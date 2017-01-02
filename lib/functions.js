const parse = require('./parse');

module.exports = {
  valid,
  // prerelease,
  // major,
  // minor,
  // patch,
  // inc: () => { throw new Error('Not implemented'); },
};

function valid(input) {
  return parse(input).getAsText();
}

function log(msg) { console.log(msg); }
