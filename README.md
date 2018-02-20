# Testem Time Reporter

Helpful in diagnosing long running tests. Reporter shows long running tests in colors
based on thresholds. It also shows failures and error messages.

- Fast passing tests are just dots
- Slow passing tests show time to run, and test name, in color based on thresholds
- Legend at end out output shows to avoid confusion
- Longest running test printed at the end
- Total test time printed at the end

## Installation

    npm install --save-dev testem-time-reporter

## Usage

Create a `testem.js` config file that sets reporter to `testem-time-reporter`:

````
const TimeReporter = require('testem-time-reporter');

module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed&coverage',
  disable_watching: true,
  launch_in_ci: [
    'PhantomJS'
  ],
  reporter: new TimeReporter()
};
````

Run tests in an Ember CLI project, reporting only failures:

    ember test --config-file ~/work/project/testem.js

## Colors

* Red > 2 seconds
* Magenta > 1 second
* Yellow > 0.5 seconds
* Blue is for skipped tests

## Notes

This currently doesn't work with `ember test --module some-module` because Ember CLI
rewrites the `testem.json` file to accomplish this, and doesn't support the
`testem.js` file.  

See [Ember CLI config rewriting](https://github.com/ember-cli/ember-cli/blob/f4844e674d35a3651693954fc9baf0dbb03cc22f/lib/commands/test.js#L51)
and [testem.js parsing](https://github.com/airportyh/testem/blob/aa6e9767ca81ae031095779c733882ba42184f42/lib/config.js#L86).
