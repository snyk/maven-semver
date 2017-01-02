const parse = require('./parse');

module.exports = {
  valid,
  prerelease,
  major,
  minor,
  patch,
  inc: () => { throw new Error('Not implemented'); },
};

function valid(input) {
  return parse(input).getAsText();
}

function prerelease(input) {
  return parse(input).getPrereleaseComponents();
}

function major(input) {
  return parse(input).getMajorVersion();
}

function minor(input) {
  return parse(input).getMinorVersion();
}

function patch(input) {
  return parse(input).getPatchVersion();
}

function log(msg) { console.log(msg); }
