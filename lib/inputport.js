'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:inputport');
var BaseputPort = require('./baseputport');

/**
 *  InputPort prototype.
 */

var ipt = InputPort.prototype;

/**
 *  Expose `InputPort`.
 */

module.exports = InputPort;

/**
 *  Initialize a new `InputPort`.
 */

function InputPort(options, process) {
  BaseputPort.call(this, options);
  this.process = process;
}

/**
 *  Inherit from `BaseputPort.prototype`.
 */

InputPort.prototype.__proto__ = BaseputPort.prototype;

// Read
ipt.receive = function () {};

//iport.pause = function () {};
//iport.resume = function () {};
//iport.pipe = function () {};

