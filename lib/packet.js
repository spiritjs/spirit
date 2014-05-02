'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:network');
var Emitter = require('events').EventEmitter;

/**
 *  Expose Packet
 */

module.exports = Packet;

var pkt = Packet.prototype;

function Packet() {
  if (!(this instanceof Packet)) return new Packet();
}

Packet.prototype.__proto__ = Emitter.prototype;

pkt.connected = false;

pkt.connect = function () {
  this.connected = true;
  this.emit('connect', this);
};

pkt.send = function (data) {
  if (this.connected) {
    this.emit('data', data);
  }
};

pkt.disconnect = function () {
  this.connected = false;
  this.emit('disconnect', this);
};

pkt.isConnected = function () {
  return this.connected;
};
