'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:outports');
var Ports = require('./ports')
var OutPutPort = require('./outputport');

/**
 *  Initialize a new `OutPorts`.
 */

function OutPorts(ports) {
  Ports.call(this, ports);
}

/**
 *  Ports prototype.
 */

var proto = OutPorts.prototype;

/**
 *  Inherit from `Ports.prototype`.
 */

OutPorts.prototype.__proto__ = Ports.prototype;

/**
 *  Add a port.
 *
 *  @param {String} name
 *  @param {Object} options
 *  @param {Object} process
 *  @api public
 */

proto.add = function (name, options, process) {
  this.ports[name] = new OutPutPort(options, process);
  this.emit('added', name);
};

/*
OutPorts.prototype.connect = function (name, streamId) {
  if (name in this.ports) {
    this.ports[name].connect(streamId);
  }
};

OutPorts.prototype.send = function (name, data, streamId) {
  if (name in this.ports) {
    this.ports[name].send(data, streamId);
  }
};

OutPorts.prototype.disconnect = function (name, streamId) {
  if (name in this.ports) {
    this.ports[name].disconnect(namea, streamId);
  }
};
*/
