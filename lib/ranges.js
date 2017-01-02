// const parseVersion = require('./version-parser');
const rangeParse = require('./range-parser');

module.exports = {
  validRange,
  // satisfies,
  // maxSatisfying,
  // minSatisfying,
  gtr: () => { throw new Error('Not implemented'); },
  ltr: () => { throw new Error('Not implemented'); },
  outside: () => { throw new Error('Not implemented'); },
};

function validRange(input) {
  let range = rangeParse(input);
  return range.getComponents();
}
