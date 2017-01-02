const parse = require('./parse');

module.exports = {
  validRange,
  // satisfies,
  // maxSatisfying,
  // minSatisfying,
  // gtr: () => { throw new Error('Not implemented'); },
  // ltr: () => { throw new Error('Not implemented'); },
  // outside: () => { throw new Error('Not implemented'); },
};

function validRange(input) {
  // let semver = parse(input);
  // if(semver !== '') {
  //   return ['=>', semver.getAsText()];
  // }
  while(input.length > 0) {
    let element = [];
    // get closing brace
    let closingBraceIndex = getNextCommaIndex(input);
    let commaIndex = getNextCommaIndex(input);
    if(closingBraceIndex < commaIndex || commaIndex === -1) {
      // a single element in the component
      if(input[0] === '[' && input[closingBraceIndex] === ']') {
        element.push('==');
        let semver = parse(input.substring(1, closingBraceIndex));
        if(semver !== null) {
          element.push(semver.getAsText());
        }
      }
    }
    // get opening brace
    if(input[0] === '(') {
      element.push('>');
    } else if(input[0] === '[') {
      element.push('>=');
    }
  }
}

function getNextClosingBraceIndex(input) {
  let round = input.indexOf('(');
  let square = input.indexOf('[');
  return round < square ? round : square;
}

function getNextCommaIndex(input) {
  return input.indexOf(',');
}
