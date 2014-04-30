'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:network');
var Emitter = require('events').EventEmitter;
var stream = require('./stream');

/**
 *  Network prototype.
 */

var net = Network.prototype;

/**
 *  Expose `Component`.
 */

exports = module.exports = Network;

/**
 *  Initialize a new `Component`.
 *
 *  @param {Object} graph, an instance of Graph
 *  @api public
 */

function Network(graph) {
  if (!(this instanceof Network)) return new Network(graph);
  this.processes = Object.create(null);
  this.connections = [];
  this.initials = [];
  this.graph = graph;
}

/**
 *  Inherit from `Emitter.prototype`.
 */

Network.prototype.__proto__ = Emitter.prototype;

/**
 *  Get a node.
 *
 *  @param {String} id
 *  @return {Object} node
 */

net.getNode = function (id) {
  return this.processes[id];
};

/**
 *  Add a node.
 *
 *  @param {Object} node
 *    - {
 *        id:         {String}
 *        component:  {Object}
 *        metadata:   {Object}
 *      }
 *  @api public
 */

net.addNode = function (node) {
  if (!this.getNode(node.id)) this.processes[node.id] = node;
  this.emit('node:added', node);
};

/**
 *  Remove a node.
 *
 *  @param {String} id
 *  @api public
 */

net.removeNode = function (id) {
  var node = this.getNode(id);
  if (!node) return;
  node.component.shoutdown();
  delete this.processes[id];
  this.emit('node:removed', node);
};

net.connect = function () {
  // initializers
  // edgs
  // nodes
};

net.connectInPort = function (stream, node) {
  stream.target = node;
  node.component.inPorts[node.port].attach(stream);
};

net.connectOutPort = function (stream, node) {
  stream.source = node;
  node.component.outPorts[node.port].attach(stream);
};

net.connectPort = function (stream, node, inbound) {
  this['connect' + (inbound ? 'In' : 'Out') + 'Port'](stream, node);
};

net.addEdge = function (edge) {
  var stream = new stream();
  var source = this.getNode(edge.source.id);
  if (!source) throw('No source process defined.');
  if (!source.component) throw('No source component defined.');

  var target = this.getNode(edge.target.id);
  if (!target) throw('No target process defined.');
  if (!target.component) throw('No target component defined.');

  this.connectPort(stream, target, true);
  this.connectPort(stream, source, false);
  this.connections.push(stream);

  this.emit('edge:add', node);
};

net.removeEdge = function (edge) {
  var connections = this.connections, i, l, connection;
  for (i = 0, l = connections.length; i < l; i++) {
    if (edge.target.id === connection.target.id &&
        edge.target.port === connection.target.port) {

      connection.target.component.inPorts[connection.target.port].detach(connection);

      if (edge.source && edge.source.id) {
        if (edge.source.id === connection.source.id &&
            edge.source.port === connection.source.port) {
          connection.source.component.outPorts[connection.source.port].detach(connection);
        }
      }

      connections.splice(i, 1);
      i--; l--;
      this.emit('edge:remove');
    }
  }
};

net.addInitial = function (initializer) {
  var stream = new stream();
  var target = this.getNode(initializer.target.id);
  this.connectPort(stream, target, true);
  this.connections.push(stream);
  this.initials.push({
    stream: stream,
    data: initializer.source.data
  });

  this.emit('initializer:add');
};

net.removeInitial = function (initializer) {
  var connections = this.connections, i, l, connection;
  for (i = 0, l = connections.length; i < l; i++) {
    if (initializer.target.id === connection.target.id &&
        initializer.target.port === connection.target.port) {
      connection.target.component.inPorts[connection.target.port].detach(connection);
      connections.splice(i, 1);
      i--; l--;
      this.emit('initializer:remove');
    }
  }
};

net.sendInitial = function (initial) {
  initial.stream.connect();
  initial.stream.send(initial.data);
  initial.stream.disconnect();
};

net.sendInitials = function () {
  var initials = this.initials, i, l, initial;
  for (i = 0, l = initials.length; i < l; i++) {
    this.sendInitial(initials[i]);
  }
  // http://jsperf.com/empty-arr
  this.initials.length = 0;
};

net.start = function () {
  this.sendInitials();
};

/**
 *  Disconnect all connections and shutdown all processes.
 */

net.stop = function () {
  var connections = this.connections,
      processes = this.processes,
      i, l;

  for (i = 0, l = connections.length; i < l; i++) {
    connections[i].disconnect();
  }
  for (i = 0, l = processes.length; i < l; i++) {
    processes[i].component.shoutdown();
  }
};
