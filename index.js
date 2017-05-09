/* eslint-env node */
const chalk = require('chalk');
let write;

function TimeReporter (opts) {
  this.out = opts.out || process.stdout;
  this.runDuration = 0;
  this.previousDot = true;
  this.opts = opts;

  write = this.out.write.bind(this.out);
  this.failures = [];
  this.longestTest = { runDuration: 0 };
  this.longTests = [];
}

TimeReporter.prototype = {
  writeFailure: function (data) {
    write(chalk.red(`\nTest Failure - ${data.name.trim()}\n`));
    if (data.error && data.error.message) {
      write(chalk.red(data.error.message) + '\n');
      write(chalk.red(data.error.stack) + '\n');
    } else {
      write(chalk.red(`${JSON.stringify(data)}`));
    }
    this.failures.push(data);
  },

  report: function (prefix, data) {
    this.runDuration += data.runDuration;
    let dot = false;
    if (data.skipped) {
      write(chalk.blue(`\nTest Skipped - ${data.name.trim()}`));
    }
    if (data.failed) {
      this.writeFailure(data);
    }
    if (data.passed) {
      if (data.runDuration > this.longestTest.runDuration) {
        this.longestTest = data;
      }
      if (this.opts.sort && !this.done && data.runDuration > 500) {
        this.longTests.push(data);
        dot = true;
        if (!this.previousDot) {
          write('\n');
        }
        write('⌛️');
        return;
      }
      const result = `\n${data.runDuration}ms - ${data.name.trim()}`;
      if (data.runDuration > 2000) {
        write(chalk.magenta(result));
      } else if (data.runDuration > 1000) {
        write(chalk.red(result));
      } else if (data.runDuration > 500) {
        write(chalk.yellow(result));
      } else {
        dot = true;
        if (!this.previousDot) {
          write('\n');
        }
        write('.');
      }
    }
    this.previousDot = dot;
  },
  finish: function () {
    this.done = true;
    if (this.opts.sort && this.longTests.length) {
      const sorted = this.longTests.sort((a, b) => a.runDuration < b.runDuration ? -1 : 1);
      sorted.forEach(data => this.report(null, data));
    } else if (this.longestTest.name) {
      write(`\n Longest test - ${this.longestTest.runDuration}ms - ${this.longestTest.name.trim()}\n`);
    }
    write(`\n Tests completed in ${this.runDuration / 1000} seconds \n`);

    if (this.failures.length) {
      this.write('\n Failing tests: \n');
      this.failures.forEach(this.writeFailure);
    }
    write(`\nLEGEND: ${chalk.blue('Skipped')} ${chalk.magenta('Tests > 2 seconds')} ${chalk.red('Tests > 1 second')} ${chalk.yellow('Tests > 0.5 seconds')}\n`);
  }
};

module.exports = TimeReporter;
