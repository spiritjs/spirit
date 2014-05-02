'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:inports');
var Ports = require('./ports')
var InputPort = require('./inputport');

/**
 *  Expose InPorts.
 */

module.exports = InPorts;

/**
 *  Initialize a new `InPorts`.
 */

function InPorts(ports) {
  if (!(this instanceof InPorts)) return new InPorts(ports)
  Ports.call(this, ports);
}

/**
 *  Ports prototype.
 */

var proto = InPorts.prototype;

/**
 *  Inherit from `Ports.prototype`.
 */

InPorts.prototype.__proto__ = Ports.prototype;

/**
 *  Add a port.
 *
 *  @param {String} name
 *  @param {Object} options
 *  @param {Object} process
 *  @api public
 */

proto.add = function (name, options, process) {
  this.ports[name] = new InputPort(options, process);
  this.emit('added', name);
};

InPorts.prototype.on = function (name, event, callback) {
  if (name in this.ports) {
    this.ports[name].on(event, callback);
  }
};

InPorts.prototype.once = function (name, event, callback) {
  if (name in this.ports) {
    this.ports[name].once(event, callback);
  }
};
