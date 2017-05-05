/* eslint-env node */
const chalk = require('chalk');
let write;

function TimeReporter (out) {
  this.out = out || process.stdout;
  this.runDuration = 0;
  this.previousDot = true;
  write = this.out.write.bind(this.out);
  this.tests = {};
  this.longestTest = { runDuration: 0 };
}

TimeReporter.prototype = {
  report: function (prefix, data) {
    // This is stupid, for some reason report was being called twice for every test.
    if (this.tests[data.name.trim()]) {
      return;
    }
    this.tests[data.name.trim()] = true;

    this.runDuration += data.runDuration;
    let dot = false;
    if (data.skipped) {
      write(chalk.blue(`\nTest Skipped - ${data.name.trim()}`));
    }
    if (data.failed) {
      write(chalk.red(`\nTest Failure - ${data.name.trim()}\n`));
      write(JSON.stringify(data.error.message, null, 2) + '\n');
      write(typeof data.error === 'string' ? data.error : JSON.stringify(data.error, null, 2));
    }
    if (data.passed) {
      if (data.runDuration > this.longestTest.runDuration) {
        this.longestTest = data;
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
    if (this.finished) {
      return;
    }
    this.finished = true;
    write(`\n Tests completed in ${this.runDuration / 1000} seconds \n`);
    if (this.longestTest.name) {
      write(`\n Longest test - ${this.longestTest.runDuration}ms - ${this.longestTest.name.trim()}\n`);
    }
    write(`\nLEGEND: ${chalk.blue('Skipped')} ${chalk.magenta('Tests > 2 seconds')} ${chalk.red('Tests > 1 second')} ${chalk.yellow('Tests > 0.5 seconds')}\n`);
  }
};

module.exports = TimeReporter;
