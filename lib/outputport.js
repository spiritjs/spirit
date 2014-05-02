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

opt.connect = function (streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    stream.connect();
  });
};

// write
opt.send = function (data, streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    if (stream.isConnected()) {
      return stream.send(data);
    }
    stream.once('connect', function () {
      stream.send(data);
    });
    stream.connect();
  });
};

opt.disconnect = function (streamId) {
  var streams = this.getStreams(streamId);
  streams.forEach(function (stream) {
    stream.disconnect();
  });
};

opt.getStreams = function (streamId) {
  if (streamId) {
    if (this.streams[streamId]) {
      return [this.streams[streamId]];
    }
    return [];
  }
  return this.streams;
};
