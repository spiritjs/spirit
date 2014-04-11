'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:inport');
var BasePort = require('./baseport');

/**
 *  InPort prototype.
 */

var iport = InPort.prototype;

/**
 *  Expose `InPort`.
 */

module.exports = InPort;

/**
 *  Initialize a new `InPort`.
 */

function InPort(options, process) {
  this.options = options;
  this.process = process;
  BasePort.call(options);
}

/**
 *  Inherit from `BasePort.prototype`.
 */

InPort.prototype.__proto__ = BasePort.prototype;

// read
iport.receive = function () {};
