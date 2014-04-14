'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:outport');
var BasePort = require('./baseport');

/**
 *  OutPort prototype.
 */

var oport = OutPort.prototype;

/**
 *  Expose `OutPort`.
 */

module.exports = OutPort;

/**
 *  Initialize a new `OutPort`.
 */

function OutPort(options) {
  BasePort.call(options);
}

/**
 *  Inherit from `BasePort.prototype`.
 */

OutPort.prototype.__proto__ = BasePort.prototype;

oport.connect = function (streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    stream.connect();
  });
};

// write
oport.send = function (data, streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    stream.once('connect', function () {
      stream.send(data);
    });
    stream.connect();
  });
};

oport.disconnect = function (streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    stream.disconnect();
  });
};

oport.getStreams = function (streamId) {
  if (streamId) {
    if (this.streams[streamId]) {
      return [this.streams[streamId]]
    }
    return [];
  }
  return this.streams;
};
