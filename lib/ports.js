'use strict';

/**
 *  Module dependencies.
 *
 *  @private
 */

var Emitter = require('events').EventEmitter;

/**
 *  Expose Ports.
 *
 *  @api private
 */

module.exports = Ports;

/**
 *  `Ports` Interface.
 *
 *  @param {Array} ports
 *    - [
 *        { name: {String}, options: {Object} }
 *        ...
 *      ]
 */

function Ports(ports) {
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
 */

proto.add = function () {};

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

