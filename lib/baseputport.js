'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:baseputport');
var Emitter = require('events').EventEmitter;

/**
 *  BasePort prototype.
 */

var bpt = BaseputPort.prototype;

/**
 *  Expose `BaseputPort`.
 */

module.exports = BaseputPort;

/**
 *  Initialize a new `BaseputPort`.
 */

function BaseputPort(options) {
  this.options = options;

  this.packets = [];
  this.node = null;
  this.name = null;

  this.status = 0;
}

/**
 *  Inherit from `Emitter.prototype`.
 */

BaseputPort.prototype.__proto__ = Emitter.prototype;

Object.defineProperties(bpt, {
  id: {
    get: function () {
      var id = this.node && this.node.id;
      if (id && this.name) {
        return id + this.name.toUpperCase();
      }
      return 'Port';
    }
  },

  dataType: {
    get: function () {
      return this.options.dataType;
    }
  },

  description: {
    get: function () {
      return this.options.description;
    }
  }
});

bpt.attach = function (packet, index) {
  if (!index) index = this.packets.length;
  this.packets[index] = packet;

  this.attachPacket(packet, index);
  this.emit('attached', packet);
};

bpt.attachPacket = function (packet, index) {
  var self = this;
  packet.on('connect', function () {
    self.emit('connect', packet, index);
  });
  packet.on('send', function (data) {
    self.emit('send', data);
  });
  packet.on('data', function (data) {
    self.emit('data', data);
  });
  packet.on('disconnect', function () {
    self.emit('disconnect', packet, index);
  });
};

bpt.detach = function (packet) {
  var index = this.packets.indexOf(packet);
  if (index === -1) return;
  this.packets.splice(index, 1);
  this.emit('detached', packet);
};
