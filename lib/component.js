'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:component');
var Emitter = require('events').EventEmitter;
var ports = require('./ports');
var InPorts = ports.InPorts;
var OutPorts = ports.OutPorts;

/**
 *  Component prototype.
 */

var com = Component.prototype;

/**
 *  Expose `Component`.
 */

exports = module.exports = Component;

/**
 *  Initialize a new `Component`.
 *
 *  @api public
 */

function Component(options) {
  if (!(this instanceof Component)) return new Component(options);
  var inPorts = options.inPorts;
  var outPorts = options.outPorts;
  if (!(inPorts instanceof InPorts)) inPorts = new InPorts(inPorts);
  if (!(outPorts instanceof OutPorts)) outPorts = new OutPorts(OutPorts);
  inPorts.component = outPorts.component = this;
  this.inPorts = inPorts;
  this.outPorts = outPorts;
  this.metedata = Object.create(options.metedata);
  debug('Created a component: %j', this);
}

/**
 *  Inherit from `Emitter.prototype`.
 */

Component.prototype.__proto__ = Emitter.prototype;

/**
 *  Return metedata
 *
 *  @return {Object}
 *  @api public
 */

com.getMetedata = function () {
  return this.metedata;
};

com.shoutdown = function () {};
