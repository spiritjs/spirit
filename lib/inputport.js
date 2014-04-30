'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:inputport');
var BasePutPort = require('./baseputport');

/**
 *  InPutPort prototype.
 */

var ipt = InPutPort.prototype;

/**
 *  Expose `InPutPort`.
 */

module.exports = InPutPort;

/**
 *  Initialize a new `InPutPort`.
 */

function InPutPort(options, process) {
  BasePutPort.call(options);
  this.process = process;
}

/**
 *  Inherit from `BasePutPort.prototype`.
 */

InPort.prototype.__proto__ = BasePutPort.prototype;

// Read
ipt.receive = function () {};

//iport.pause = function () {};
//iport.resume = function () {};
//iport.pipe = function () {};

