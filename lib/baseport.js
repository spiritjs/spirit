'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:baseport');
var Emitter = require('events').EventEmitter;

/**
 *  BasePort prototype.
 */

var port = BasePort.prototype;

/**
 *  Expose `BasePort`.
 */

module.exports = BasePort;

/**
 *  Initialize a new `BasePort`.
 */

function BasePort(options, process) {
  this.options = options;
  this.streams = [];
  this.node = null;
  this.name = null;
}

/**
 *  Inherit from `Emitter.prototype`.
 */

BasePort.prototype.__proto__ = Emitter.prototype;

Object.defineProperties(port, {
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

port.attach = function (stream, index) {
  if (!index) index = this.streams.length;
  this.streams[index] = stream;
  this.emit('attached', stream);
};

port.detach = function (stream) {
  var index = this.streams.indexOf(stream);
  if (index === -1) return;
  this.streams.splice(index, 1);
  this.emit('detached', stream);
};
