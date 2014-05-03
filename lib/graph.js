'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:graph');
var Emitter = require('events').EventEmitter;
var empty = require('empty-object');

/**
 *  Graph prototype.
 */

var graph = Graph.prototype;

/**
 *  Expose `Graph`.
 */

exports = module.exports = Graph;

/**
 *  Initialize a new `Component`.
 *
 *  @api public
 */

function Graph(name) {
  if (!(this instanceof Graph)) return new Graph(name);
  this.name = name || '';
  this.metadata = Object.create(null);

  this.nodes = [];
  this.edges = [];
  this.initializers = [];

  this.inPorts = Object.create(null);
  this.outPorts = Object.create(null);
}

/**
 *  Inherit from `Emitter.prototype`.
 */

Graph.prototype.__proto__ = Emitter.prototype;

/**
 *  Add a Port.
 *
 *  @param {String} type - in|out
 *  @param {String} publicPort
 *  @param {String} id - nodeId
 *  @param {String} portKey
 *  @param {Object} metadata
 *  @api private
 */

graph.addPort = function (type, publicPort, id, portKey, metadata) {
  var node = this.getNode(id);
  if (!node) return;
  node = Object.create(null);
  //   id
  node.process = id;
  node.port = portKey;
  node.metadata = Object.create(metadata);

  var ports = this[type + 'Ports'];
  ports[publicPort] = node;
  this.emit(type + 'Port:added', publicPort, node);
};

/**
 *  Add inPort.
 *
 *  @param {String} publicPort
 *  @param {String} id - nodeId
 *  @param {String} portKey
 *  @param {Object} metadata
 *  @api public
 */

graph.addInPort = function (publicPort, id, portKey, metadata) {
  this.addPort('in', publicPort, id, portKey, metadata);
};

/**
 *  Rmeove inPort.
 *
 *  @param {String} publicPort
 *  @api public
 */

graph.removeInPort = function (publicPort) {
  var node = this.inPorts[publicPort];
  if (!node) return;
  delete this.inPorts[publicPort];
  this.emit('inPort:removed', publicPort, node);
};

/**
 *  Add outPort.
 *
 *  @param {String} publicPort
 *  @param {String} id - nodeId
 *  @param {String} portKey
 *  @param {Object} metadata
 *  @api public
 */

graph.addOutPort = function (publicPort, id, portKey, metadata) {
  this.addPort('out', publicPort, id, portKey, metadata);
};

graph.removeOutPort = function (publicPort) {
  var node = this.outPorts[publicPort];
  if (!node) return;
  delete this.outPorts[publicPort];
  this.emit('outPort:removed', publicPort, node);
};

/**
 *  Get a node by id.
 *
 *  @param {String} id
 *  @return {Object} node|null
 *  @api public
 */

graph.getNode = function (id) {
  var nodes = this.nodes, i, l, node;
  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    if (node.id === id) {
      // `_index`
      node._index = i;
      return node;
    }
  }
  return null;
};

/**
 *  Add a node.
 *
 *  @param {String} id
 *  @param {Object} component
 *  @param {Object} metadata
 *  @api public
 */

graph.addNode = function (id, component, metadata) {
  var node = this.getNode(id);
  if (node) return node;
  node = Object.create(null);
  node.id = id;
  node.component = component;
  node.metadata = Object.create(metadata || null);
  this.nodes.push(node);
  this.emit('node:added', node);
};

/**
 *  Remove a node by id.
 * 
 *  @param {String} id
 *  @api public
 */

graph.removeNode = function (id) {
  var node = this.getNode(id);
  if (!node) return;
  var i, l;

  // Remove the node from edges:
  var edges = this.edges, edge;
  for (i = 0, l = edges.length; i < l; i++) {
    edge = edges[i];
    if (edge.source.id === id || edge.target.id === id) {
      this.removeEdge(edge.source, edge.target);
      i--;
      l--;
    }
  }

  // Remove the node from initializers:
  var initializers = this.initializers, initializer;
  for (i = 0, l = initializers.length; i < l; i++) {
    initializer = initializers[i];
    if (initializer.target.id === id) {
      this.removeInitial(initializer.target);
      i--;
      l--;
    }
  }

  var ports;
  // Remove the node from inPorts:
  ports = this.inPorts;
  for (i in ports) {
    if (ports[i].process === id) {
      this.removeInPort(i);
    }
  }

  // Remove the node from outPorts:
  ports = this.outPorts;
  for (i in ports) {
    if (ports[i].process === id) {
      this.removeOutPort(i);
    }
  }

  // Remove the node from nodes:
  this.nodes.splice(node._index, 1);
  this.emit('node:removed', node);
};

/**
 *  Get an eget by source and target.
 *
 *  @param {Object} source  - out
 *    - { id: {String}, port: {String} }
 *  @param {Object} target  - in
 *    - { id: {String}, port: {String} }
 *  @return {Object} edge|null
 *  @api public
 */

graph.getEdge = function (source, target) {
  var edges = this.edges, i, l, e, s, t;
  for (i = 0, l = edges.length; i < l; i++) {
    e = edges[i];
    s = e.source;
    t = e.target;
    if (s.id === source.id && s.port === source.port &&
        t.id === target.id && t.port === target.port) {
      return e;
    }
  }
  return null;
};

/**
 *  Add an edge.
 *
 *  @param {Object} source  - out
 *    - { id: {String}, port: {String} }
 *  @param {Object} target  - in
 *    - { id: {String}, port: {String} }
 *  @api public
 */

graph.addEdge = function (source, target, metadata) {
  var edge = this.getEdge(source, target);
  if (edge) return edge;
  var node;
  node = this.getNode(source.id);
  if (!node) return;
  node = this.getNode(target.id);
  if (!node) return;

  edge = Object.create(null);
  edge.source = source;
  edge.target = target;
  edge.metadata = Object.create(metadata || null);
  //edge.id
  this.edges.push(edge);
  this.emit('edge:added', edge);
};

/**
 *  Remove an edge.
 *
 *  @param {Object} source
 *  @param {Object} target
 *  @api public
 */

graph.removeEdge = function (source, target) {
  var edges = this.edges, i = 0, l = edges.length, e, s, t;
  var both = !!target, status;
  for (; i < l; i++) {
    e = edges[i];
    s = e.source;
    t = e.target;
    if (both) {
      status = s.id === source.id && s.port === source.port &&
        t.id === target.id && t.port === target.port;
    } else {
      status = s.id === source.id && s.port === source.port ||
        t.id === target.id && t.port === target.port;
    }
    if (status) {
      edges.splice(i, 1);
      i--;
      l--;
      this.emit('edge:removed', e);
    }
  }
};

/**
 *  Add an initializer.
 *
 *  @param {Mixed} data - source data
 *  @param {Object} target  - in
 *        nodeId
 *    - { id: {String}, port: {String} }
 *  @api public
 */

graph.addInitial = function (source, target, metadata) {
  if (!this.getNode(target.id)) return;
  var edge = Object.create(null);
  edge.source = source;
  edge.target = target;
  edge.metadata = Object.create(metadata || null);
  this.initializers.push(edge);
  this.emit('initial:added', edge);
};

/**
 *  Remove an initializer.
 *
 *  @param {Object} target
 *  @api public
 */

graph.removeInitial = function (target) {
  var initializers = this.initializers, i = 0, l = initializers.length, edge, t;
  for (; i < l; i++) {
    edge = initializers[i];
    t = edge.target;
    if (t.id === target.id && t.port === target.port) {
      initializers.splice(i, 1);
      i--;
      l--;
      this.emit('initial:removed', edge);
    }
  }
};

/**
 *  Forced to kill the graph.
 *
 *  @api public 
 */

graph.kill = function () {
  this.nodes.length = 0;
  this.edges.length = 0;
  this.initializers.length = 0;
  delete this.nodes;
  delete this.edges;
  delete this.initializers;
  delete this.inPorts;
  delete this.outPorts;
  this.emit('kill');
};

/**
 *  Clear the graph.
 *  
 *  @return {object} self
 *  @api public
 */

graph.clear = function () {
  this.nodes.length = 0;
  this.edges.length = 0;
  this.initializers.length = 0;

  empty(this.inPorts);
  empty(this.outPorts);

  this.emit('clear');
  return this;
};
