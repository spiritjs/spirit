'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:outputport');
var BaseputPort = require('./baseputport');

/**
 *  OutputPort prototype.
 */

var opt = OutputPort.prototype;

/**
 *  Expose `OutPutPort`.
 */

module.exports = OutputPort;

/**
 *  Initialize a new `OutputPort`.
 */

function OutputPort(options) {
  BaseputPort.call(this, options);
}

/**
 *  Inherit from `BaseputPort.prototype`.
 */

OutputPort.prototype.__proto__ = BaseputPort.prototype;

opt.connect = function (packetId) {
  var packets = this.getpackets(packetId);
  packets.forEach(function (packet) {
    packet.connect();
  });
};

// write
opt.send = function (data, packetId) {
  var packets = this.getpackets(packetId);
  packets.forEach(function (packet) {
    if (packet.isConnected()) {
      return packet.send(data);
    }
    packet.once('connect', function () {
      packet.send(data);
    });
    packet.connect();
  });
};

opt.disconnect = function (packetId) {
  var packets = this.getpackets(packetId);
  packets.forEach(function (packet) {
    packet.disconnect();
  });
};

opt.getpackets = function (packetId) {
  if (packetId) {
    if (this.packets[packetId]) {
      return [this.packets[packetId]];
    }
    return [];
  }
  return this.packets;
};
