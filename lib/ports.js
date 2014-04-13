'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:ports');
var Emitter = require('events').EventEmitter;
var InPort = require('./inport');
var OutPort = require('./outport');

/**
 *  Expose modes.
 */

var modes = module.exports;

/**
 *  Expose `InPorts`.
 */

modes.InPorts = InPorts;

/**
 *  Expose `OutPorts`.
 */

modes.OutPorts = OutPorts;

/**
 *  `Ports` Interface.
 *
 *  @param {String} mode
 *    - InPorts
 *    - OutPorts
 *  @param {Array} ports
 *    - [
 *        { name: {String}, options: {Object} }
 *        ...
 *      ]
 *  @api private
 */

function Ports(mode, ports) {
  this.mode = mode;
  this.ports = Object.create(null);
  if (ports) {
    var i = 0, len = ports.length, port;
    for (; i < len; i++) {
      port = ports[i];
      this.add(port.name, port.options);
    }
  }
}

/**
 *  Ports prototype.
 */

var proto = Ports.prototype;

/**
 *  Inherit from `Emitter.prototype`.
 */

Ports.prototype.__proto__ = Emitter.prototype;

/**
 *  Add a port.
 *
 *  @param {String} name
 *  @param {Object} options
 *  @param {Object} process
 *  @api public
 */

proto.add = function (name, options, process) {
  this.ports[name] = new modes[this.mode](options, process);
  this.emit('added', name);
};

/**
 *  Remove a port
 *
 *  @param {String} name
 *  @api public
 */

proto.remove = function (name) {
  delete this.ports[name];
  this.emit('removed', name);
};

/**
 *  Initialize a new `InPorts`.
 */

function InPorts(ports) {
  Ports.call(this, 'InPorts', ports);
}

/**
 *  Inherit from `Ports.prototype`.
 */

InPorts.prototype.__proto__ = Ports.prototype;

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

/**
 *  Initialize a new `OutPorts`.
 */

function OutPorts(ports) {
  Ports.call(this, 'OutPort', ports);
}

/**
 *  Inherit from `Ports.prototype`.
 */

OutPorts.prototype.__proto__ = Ports.prototype;

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
