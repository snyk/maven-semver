const parseVersion = require('./version-parser');

module.exports = parseRange;

function parseRange(input) {
  let versionRange = new MavenVersionRange();
  if(input[0] !== '(' && input[0] !== '[') {
    // no bounds - just a single version in the string
    // turn it into a bounded version
    input = '[' + input + ',)';
  }
  let componentStrings = getComponentStrings(input);
  for(var i = 0; i < componentStrings.length; i++) {
    versionRange.addComponent(processComponent(componentStrings[i]));
  }
  return versionRange;
}

function getComponentStrings(input) {
  let componentStrings = [];
  while(true) {
    let compMarker = getNextComponent(input);
    if(compMarker) {
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
  if(openingBrace === -1) {
    return false;
  }
  let closingBrace = getNextClosingBraceIndex(input);
  if(closingBrace === -1) {
    return false;
  }
  return {
    startIndex: openingBrace,
    endIndex: closingBrace
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
  let component = [];
  let minBound = input[0];
  let maxBound = input[input.length - 1];
  let version = getVersions(input.substring(1, input.length - 1));
  if(version.singleVersion) {
    if(minBound === '[' && maxBound === ']') {
      component.push('==');
      component.push(version.singleVersion.getAsText());
    }
  } else {
    if(version.minVersion) {
      component.push(minBound === '(' ? '>' : '>=');
      component.push(version.minVersion.getAsText());
    }
    if(version.maxVersion) {
      component.push(maxBound === ')' ? '<' : '<=');
      component.push(version.maxVersion.getAsText());
    }
  }
  return component;
}

function getVersions(input) {
  let commaIndex = input.indexOf(',');
  if(commaIndex === -1) {
    return {singleVersion: parseVersion(input)};
  }
  let result = {};
  if(commaIndex > 1) {
    result.minVersion = parseVersion(
      input.substring(0, commaIndex));
  }
  if(commaIndex < input.length - 2) {
    result.maxVersion = parseVersion(
      input.substring(commaIndex + 1, input.length));
  }
  return result;
}

class MavenVersionRange {
  constructor() {
    this._components = []
  }

  addComponent(component) {
    this._components.push(component);
  }

  getComponents() {
    return this._components;
  }
}
