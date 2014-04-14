'use strict';

/**
 *  Empty Object
 *
 *  @param {Object} obj
 *  @api public
 */

exports.emptyObject = function (obj) {
  var k;
  for (k in obj) {
    delete obj[k];
  }
  return obj;
};
