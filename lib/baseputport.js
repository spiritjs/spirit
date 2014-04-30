'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:baseputport');
var Emitter = require('events').EventEmitter;

/**
 *  BasePort prototype.
 */

var bpt = BasePort.prototype;

/**
 *  Expose `BasePort`.
 */

module.exports = BasePutPort;

/**
 *  Initialize a new `BasePutPort`.
 */

function BasePutPort(options) {
  this.options = options;

  // Packet[]
  this.streams = [];
  this.node = null;
  this.name = null;

  this.status = 0;
}

/**
 *  Inherit from `Emitter.prototype`.
 */

BasePort.prototype.__proto__ = Emitter.prototype;

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

bpt.attach = function (stream, index) {
  if (!index) index = this.streams.length;
  this.streams[index] = stream;
  this.emit('attached', stream);
};

bpt.detach = function (stream) {
  var index = this.streams.indexOf(stream);
  if (index === -1) return;
  this.streams.splice(index, 1);
  this.emit('detached', stream);
};

// Close Connection
bpt.connect = function () {};
opt.isConnected = function () {};

