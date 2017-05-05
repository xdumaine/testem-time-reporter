var TimeReporter = require('./index');
var reporter = new TimeReporter();

module.exports = {
  'launch_in_ci': [ 'CI' ],
  'launchers': {
    'CI': {
      'command': 'mocha --timeout 3000 test.js'
    }
  },
  reporter: reporter
};
