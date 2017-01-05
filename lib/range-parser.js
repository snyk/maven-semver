const parseVersion = require('./version-parser');

module.exports = parseRange;

function parseRange(input) {
  input = normalizeRangeString(input);
  let components = getComponentsAsStrings(input);
  if(components.length === 0) {
    // no legal components found - this is not a valid range
    return new MavenVersionRange();
  }
  return new MavenVersionRange(input, components);
}

function normalizeRangeString(input) {
  // remove all white-spaces
  input = input.replace(/ /g,'');
  if (input.match(/\(|\[|\)|\]/) === null) {
    // no bounds - just a single version in the string
    // turn it into a bounded version
    input = '[' + input + ',)';
  }
  return input;
}

class MavenVersionRange {
  constructor(range, components) {
    this._rangeAsText = range || '';
    this._components = [];
    components = components || [];
    for (var i = 0; i < components.length; i++) {
      this.addComponent(processComponent(components[i]));
    }
  }

  addComponent(component) {
    this._components.push(component);
  }

  getComponents() {
    return this._components;
  }

  getAsText() {
    return this._rangeAsText;
  }
}

function getComponentsAsStrings(input) {
  let componentStrings = [];
  while (true) {
    let compMarker = getNextComponent(input);
    if (compMarker) {
      componentStrings.push(
        input.substring(compMarker.startIndex, compMarker.endIndex + 1));
      input = input.substring(compMarker.endIndex + 1);
    } else {
      break;
    }
  }
  return componentStrings;
}

// return the next component's string
function getNextComponent(input) {
  let openingBrace = getNextOpeningBraceIndex(input);
  if (openingBrace === -1) {
    return false;
  }
  let closingBrace = getNextClosingBraceIndex(input);
  if (closingBrace === -1) {
    return false;
  }
  return {
    startIndex: openingBrace,
    endIndex: closingBrace,
  };
}

// find the index of the next opening brace - either '(' or '['
// return -1 if none is found
function getNextOpeningBraceIndex(input) {
  let match = input.match(/\(|\[/);
  return match === null ? -1 : match.index;
}

// find the index of the next closing brace - either ')' or ']'
// return -1 if none is found
function getNextClosingBraceIndex(input) {
  let match = input.match(/\]|\)/);
  return match === null ? -1 : match.index;
}

function processComponent(input) {
  let component = {};
  let minBound = input[0];
  let maxBound = input[input.length - 1];
  let version = getVersions(input.substring(1, input.length - 1));
  if (version.singleVersion) {
    if (minBound === '[' && maxBound === ']') {
      component.minOperator = '==';
      component.minOperand = version.singleVersion.getAsText();
    }
  } else {
    if (version.minVersion) {
      component.minOperator = (minBound === '(' ? '>' : '>=');
      component.minOperand = version.minVersion.getAsText();
    }
    if (version.maxVersion) {
      component.maxOperator = (maxBound === ')' ? '<' : '<=');
      component.maxOperand = version.maxVersion.getAsText();
    }
  }
  return component;
}

function getVersions(input) {
  let commaIndex = input.indexOf(',');
  if (commaIndex === -1) {
    return {singleVersion: parseVersion(input)};
  }
  let result = {};
  if (commaIndex > 1) {
    result.minVersion = parseVersion(
      input.substring(0, commaIndex));
  }
  if (commaIndex < input.length - 2) {
    result.maxVersion = parseVersion(
      input.substring(commaIndex + 1, input.length));
  }
  return result;
}
