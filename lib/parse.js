module.exports = parse;

function parse(input) {
  if(typeof input === 'undefined' ||
    typeof input !== 'string' ||
    input === null ||
    input === '') {
    return new MavenSemver();
  }
  // edge case: only dots and dashes
  let edge1 = input.match(/^(\W+)$/g);
  if(edge1 !== null && edge1[0] === input) {
    return new MavenSemver();
  }

  input = input.toLowerCase();

  let semver = new MavenSemver();

  // find the first DASH
  const firstDash = input.indexOf('-');
  const firstLetter = input.match(/[a-z]/);
  let qualifierStart;
  if(firstDash !== -1) {
    if(firstLetter !== null && firstLetter.index < firstDash) {
      qualifierStart = firstLetter.index;
    } else {
      qualifierStart = firstDash;
    }
  } else if(firstLetter !== null) {
    qualifierStart = firstLetter.index;
  } else {
    qualifierStart = input.length;
  }
  semver.setVersion(input.substring(0, qualifierStart));
  semver.setQualifier(input.substring(qualifierStart));

  return semver;
}

class MavenSemver {
  constructor() {
    this._versions = [];
    this._qualifiers = [];
  }

  setVersion(version) {
    this._versions = version.split('.');
  }

  setQualifier(qualifier) {
    let dashSeparated = qualifier.split('-');
    for(var i = 0; i < dashSeparated.length; i++) {
      this.parseQualifier(dashSeparated[i]);
    }
  }

  parseQualifier(qualifier) {
    if(qualifier === '') {
      return;
    }
    let match = qualifier.match(/\d+/)
    if(match === null) {
      this._qualifiers.push(qualifier);
    } else {
      this.addNextToken(qualifier, match.index === 0);
    }
  }

  addNextToken(qualifier, digits) {
    if(qualifier === '') {
      return;
    }
    let match = digits ?
      qualifier.match(/\d+/) :
      qualifier.match(/[a-z]+/);
    if(match === null) {
      return;
    }
    let element = qualifier.substring(0, match[0].length);
    this._qualifiers.push(element);
    this.addNextToken(qualifier.substring(element.length), !digits);
  }

  getAsText() {
    return this.getVersionsAsText() + this.getQualifiersAsText();
  }

  getVersionsAsText() {
    let result = [];
    for(var i = 0; i < this._versions.length; i++) {
      result.push(this._versions[i]);
      result.push('.');
    }
    result.pop();
    return result.join('');
  }

  getQualifiersAsText() {
    let result = [];
    for(var i = 0; i < this._qualifiers.length; i++) {
      result.push('-');
      result.push(this._qualifiers[i]);
    }
    return result.join('');
  }
}
