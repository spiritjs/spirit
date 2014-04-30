'use strict';

/**
 *  Module dependencies.
 */

var debug = require('debug')('spirit:outputport');
var BasePutPort = require('./baseputport');

/**
 *  OutPutPort prototype.
 */

var opt = OutPutPort.prototype;

/**
 *  Expose `OutPutPort`.
 */

module.exports = OutPutPort;

/**
 *  Initialize a new `OutPutPort`.
 */

function OutPutPort(options) {
  BasePutPort.call(options);
}

/**
 *  Inherit from `BasePutPort.prototype`.
 */

OutPutPort.prototype.__proto__ = BasePutPort.prototype;

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
      return [this.streams[streamId]]
    }
    return [];
  }
  return this.streams;
};
