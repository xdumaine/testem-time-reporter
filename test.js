/* global describe, it */

var PassThrough = require('stream').PassThrough;
var TimeReporter = require('./index');
var assert = require('chai').assert;

describe('test failure reporter', function () {
  it('writes out fast results as dots, plus a summary', function () {
    var stream = new PassThrough();
    var reporter = new TimeReporter({ out: stream });
    reporter.report('phantomjs', {
      name: 'it does stuff',
      passed: true,
      runDuration: 300,
      logs: []
    });
    reporter.report('phantomjs', {
      name: 'it does more stuff',
      passed: true,
      runDuration: 300,
      logs: ['I am a log', 'Useful information']
    });
    reporter.finish();
    var output = stream.read().toString();
    // one line for all success plus 6 for summary
    assert.equal(output.split('\n').length, 7);
    assert.match(output, /\.\./); // two dots for passes
  });

  it('writes out slow results as lines with run duration, plus a summary', function () {
    var stream = new PassThrough();
    var reporter = new TimeReporter({ out: stream });
    reporter.report('phantomjs', {
      name: 'it does stuff',
      passed: true,
      runDuration: 300,
      logs: []
    });
    reporter.report('phantomjs', {
      name: 'it takes a while',
      passed: true,
      runDuration: 3000,
      logs: ['I am a log', 'Useful information']
    });
    reporter.report('phantomjs', {
      name: 'it takes a while more',
      passed: true,
      runDuration: 5000,
      logs: ['I am a log', 'Useful information']
    });
    reporter.finish();
    var output = stream.read().toString();
    // one line fast success, two for slow success, plus 6 for summary
    assert.equal(output.split('\n').length, 9);
    assert.match(output, /3000ms - it takes a while/); // log long test
    assert.match(output, /Longest test - 5000ms - it takes a while more/); // Log as longest test
  });

  it('can sort out slow tests', function () {
    var stream = new PassThrough();
    var reporter = new TimeReporter({ out: stream, sort: true });
    reporter.report('phantomjs', {
      name: 'it does stuff',
      passed: true,
      runDuration: 300,
      logs: []
    });
    reporter.report('phantomjs', {
      name: 'it takes a while more',
      passed: true,
      runDuration: 5000,
      logs: ['I am a log', 'Useful information']
    });
    reporter.report('phantomjs', {
      name: 'it takes a long damn time',
      passed: true,
      runDuration: 9000,
      logs: ['I am a log', 'Useful information']
    });
    reporter.report('phantomjs', {
      name: 'it takes a while',
      passed: true,
      runDuration: 3000,
      logs: ['I am a log', 'Useful information']
    });
    reporter.finish();
    var output = stream.read().toString();
    // one line fast success, three for slow success, plus 5 for summary (no longest line)
    assert.equal(output.split('\n').length, 8);
    const index1 = output.indexOf('3000ms - it takes a while');
    const index2 = output.indexOf('5000ms - it takes a while more');
    const index3 = output.indexOf('9000ms - it takes a long damn time');
    assert.equal(-1 < index1 < index2 < index3, true); // eslint-disable-line
    assert.equal(output.indexOf('Longest'), -1);
  });
});
