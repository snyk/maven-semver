module.exports = parseVersion;

function parseVersion(input) {
  let semver = new MavenSemver();
  if(typeof input === 'undefined' ||
    typeof input !== 'string' ||
    input === null ||
    input === '' ||
    input.match(/[^\w\.-]/) !== null) {
      semver.error = true;
      return semver;
  }
  // edge case: only dots and dashes
  let dotsAndDashes = input.match(/^(\W+)$/g);
  if(dotsAndDashes !== null && dotsAndDashes[0] === input) {
    semver.error = true;
    return semver;
  }

  input = input.toLowerCase();

  // find the first DASH or letter
  const firstDash = input.indexOf('-');
  const firstLetter = input.match(/[a-z]/);
  let qualifierStart;
  if(firstLetter !== null && firstLetter.index === 0) {
    semver.setVersion(input);
    return semver;
  }
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
  // public methods
  getAsText() {
    return this.getVersionsAsText() + this.getQualifiersAsText();
  }

  getPrereleaseComponents() {
    return this._qualifiers.length === 0 ? null : this._qualifiers;
  }

  getMajorVersion() {
    return parseInt(this._versions[0]) || 0;
  }

  getMinorVersion() {
    return parseInt(this._versions[1]) || 0;
  }

  getPatchVersion() {
    return parseInt(this._versions[2]) || 0;
  }

  getVersions() {
    return this._versions;
  }

  constructor() {
    this._versions = [];
    this._qualifiers = [];
  }

  setVersion(version) {
    let versions = version.split('.');
    for(var i = 0; i < versions.length; i++) {
      let version = parseInt(versions[i]);
      this._versions.push(isNaN(version) ? versions[i] : version);
    }
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

  addNextToken(qualifier, isInteger) {
    if(qualifier === '') {
      return;
    }
    if(qualifier.indexOf('.') !== -1) {
      this._qualifiers.push(qualifier);
      return;
    }
    let match = isInteger ?
      qualifier.match(/\d+/) :
      qualifier.match(/\D+/);
    if(match === null) {
      return;
    }
    let element = qualifier.substring(0, match[0].length);
    this._qualifiers.push(isInteger ? parseInt(element) : element);
    this.addNextToken(qualifier.substring(element.length), !isInteger);
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
