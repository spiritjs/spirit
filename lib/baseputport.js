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

  // Packet[]
  this.streams = [];
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

bpt.attach = function (stream, index) {
  if (!index) index = this.streams.length;
  this.streams[index] = stream;

  this.attachStream(stream, index);
  this.emit('attached', stream);
};

bpt.attachStream = function (stream, index) {
  var self = this;
  stream.on('connect', function () {
    self.emit('connect', stream, index);
  });
  stream.on('send', function (data) {
    self.emit('send', data);
  });
  stream.on('data', function (data) {
    self.emit('data', data);
  });
  stream.on('disconnect', function (data) {
    self.emit('disconnect', stream, index);
  });
};

bpt.detach = function (stream) {
  var index = this.streams.indexOf(stream);
  if (index === -1) return;
  this.streams.splice(index, 1);
  this.emit('detached', stream);
};
