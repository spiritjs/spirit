'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:network');
var Emitter = require('events').EventEmitter;

/**
 *  Expose Streamer
 */

module.exports = Streamer;

var stp = Streamer.prototype;

function Streamer() {
  if (!(this instanceof Streamer)) return new Streamer();
}

Streamer.prototype.__proto__ = Emitter.prototype;

stp.connected = false;

stp.connect = function () {
  this.connected = true;
  this.emit('connect', this);
};

stp.send = function (data) {
  if (this.connected) {
    this.emit('data', data);
  }
};

stp.disconnect = function () {
  this.connected = false;
  this.emit('disconnect', this);
};

stp.isConnected = function () {
  return this.connected;
};
