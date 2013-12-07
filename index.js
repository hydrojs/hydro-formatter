/**
 * Core dependencies.
 */

var path = require('path');
var basename = path.basename;
var extname = path.extname;

/**
 * External dependencies.
 */

var extend = require('super').extend;
var ms = require('ms');

/**
 * Internal dependencies.
 */

var color = require('./color');

/**
 * Noop.
 */

var noop = function(){};

/**
 * Base formatter.
 *
 * @constructor
 */

function Formatter() {
  this.out = process.stdout;
  this.padding = new Array(4).join(' ');
  this.tests = [];
  this.failed = [];
  this.skipped = [];
  this.passed = [];
}

/**
 * Inheritance.
 *
 * @api public
 */

Formatter.extend = extend;

/**
 * Setup.
 *
 * @param {Hydro} hydro
 * @api public
 */

Formatter.prototype.use = function(hydro) {
  var self = this;

  hydro.on('post:test', function(test) {
    self.tests.push(test);
    if (test.skipped) return self.skipped.push(test);
    if (test.failed) return self.failed.push(test);
    self.passed.push(test);
  });

  hydro.on('pre:all', this.beforeAll.bind(this));
  hydro.on('pre:suite', this.beforeSuite.bind(this));
  hydro.on('pre:test', this.beforeTest.bind(this));
  hydro.on('post:test', this.afterTest.bind(this));
  hydro.on('post:suite', this.afterSuite.bind(this));
  hydro.on('post:all', this.afterAll.bind(this));
};

/**
 * Before all tests.
 *
 * @api public
 */

Formatter.prototype.beforeAll = noop;

/**
 * Before test suite.
 *
 * @api public
 */

Formatter.prototype.beforeSuite = noop;

/**
 * Before each tests.
 *
 * @api public
 */

Formatter.prototype.beforeTest = noop;

/**
 * After test.
 *
 * @param {Test} test
 * @api public
 */

Formatter.prototype.afterTest = noop;

/**
 * After test suite.
 *
 * @param {Result} result
 * @api public
 */

Formatter.prototype.afterSuite = noop;

/**
 * After all tests.
 *
 * @param {Result} result
 * @api public
 */

Formatter.prototype.afterAll = noop;

/**
 * Attach `ms` for inheriting formatters.
 */

Formatter.prototype.ms = ms;

/**
 * Attach `color` for inheriting formatters.
 */

Formatter.prototype.color = color;

/**
 * Print `msg`.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.print = function(msg) {
  msg = msg || '';
  this.out.write(msg);
};

/**
 * Print `msg` + \n.
 *
 * @param {String} msg
 * @api private
 */

Formatter.prototype.println = function(msg) {
  msg = msg || '';
  msg = this.padding + msg;
  this.print(msg + '\n');
};

/**
 * Display failed tests.
 *
 * @api private
 */

Formatter.prototype.displayFailed = function() {
  this.failed.forEach(function(test, i) {
    this.println((i + 1) + '. ' + test.title);
    this.println(color('gray', test.error.stack));
    this.println();
  }, this);
};

/**
 * Display test results.
 *
 * @api private
 */

Formatter.prototype.displayResult = function() {
  var failures = this.failed.length;
  var skipped = this.skipped.length;
  var total = this.tests.length;
  var c = failures === 0 ? 'green' : 'red';
  var time = this.tests.reduce(function(sum, test) {
    return sum + test.time;
  }, 0);

  this.println();
  this.println('Finished in ' + this.ms(time));
  this.println(color(c, total + ' tests, ' + failures + ' failures, ' + skipped + ' skipped'));
  this.println();
};

/**
 * Primary export.
 */

module.exports = Formatter;
