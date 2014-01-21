var Formatter = require('./');
var chai = require('chai');
var assert = require('assert');

chai.Assertion.includeStack = true;

// failures, passing, pending

var all = new Formatter;

var chaiErr = null;
var assertErr = null;
var errnoStack = new Error('look ma, no stack');
errnoStack.showStack = false;

try {
  chai.expect({ foo: 'bar' }).to.eq(['1', 'b']);
} catch (e) {
  chaiErr = e;
}

try {
  assert(1 === 2, 'oops');
} catch (e) {
  assertErr = e;
}

all.failed = [
  { time: 1, title: 'chai error', error: chaiErr },
  { time: 1, title: 'assert error', error: assertErr },
  { time: 1, title: 'no stack', error: errnoStack },
];

all.skipped = [ { time: 1 } ];
all.pending = [ { time: 1 } ];

all.tests = [ {time: 1 }]
  .concat(all.pending)
  .concat(all.skipped)
  .concat(all.failed);

all.displayResult();
all.displayFailed();

all.hydro = { get: function(){return false} }

// should hide stack

console.log();
all.displayFailed();

// passing tests

var passing = new Formatter;
passing.tests = [ { time: 1 }, { time: 1 }, { time: 1 }, { time: 1 } ];
passing.displayResult();
passing.displayFailed();

// 0 tests

var none = new Formatter;
none.tests = [];
none.displayResult();
none.displayFailed();
