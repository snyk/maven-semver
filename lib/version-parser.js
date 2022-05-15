module.exports = parseVersion;

const ALIASES = {
  a: 'alpha',
  b: 'beta',
  cr: 'rc',
  m: 'milestone',
  // for spring. see 65129aab72905869300a87f1118c12e99f0ad5af
  sec: 'sp',
  security: 'sp',
  ga: 0,
  final: 0,
};

const PRERELEASES = new Set([
  'nightly', 'alpha', 'beta', 'incubating', 'preview', 'snapshot', 'ea',
  'milestone', 'test', 'rc', 'pre',
]);

function parseVersion(input) {
  let semver = new MavenSemver();
  if (!validateInput(input)) {
    semver.error = true;
    return semver;
  }

  input = input.toLowerCase();

  // find the first DASH or letter
  const firstDash = input.indexOf('-');
  const firstLetter = input.match(/[a-z]/);
  let qualifierStart;
  if (firstLetter !== null && firstLetter.index === 0) {
    semver.setVersion(input);
    return semver;
  }
  if (firstDash !== -1) {
    if (firstLetter !== null && firstLetter.index < firstDash) {
      qualifierStart = firstLetter.index;
    } else {
      qualifierStart = firstDash;
    }
  } else if (firstLetter !== null) {
    qualifierStart = firstLetter.index;
  } else {
    qualifierStart = input.length;
  }
  semver.setVersion(input.substring(0, qualifierStart));
  semver.setQualifier(input.substring(qualifierStart));

  return semver;
}

// GA & Final should be "trimmed" according to:
// https://maven.apache.org/pom.html#Version_Order_Specification
// - We decided to treat 'release' the same due to `spring-framework`
const TRIMMED_QUALIFIERS = [
  'ga', 'final', 'release',
];

// catches: "1", "1.2", but NOT "1a2", "1."
const INT_OR_DECIMAL_RE = /\d+(?:\.\d+)?/;
const STARTS_WITH_INT_OR_DECIMAL = new RegExp(
  '^' + /* must be at the start of string */
  INT_OR_DECIMAL_RE.source, INT_OR_DECIMAL_RE.flags);

class MavenSemver {
  // public methods
  getAsText() {
    return this.getVersionsAsText() + this.getQualifiersAsText();
  }

  getPrereleaseComponents() {
    if (this._qualifiers.length === 0) {
      return null;
    }

    if (String(this._qualifiers[0]).indexOf('sec') === 0) {
      return null;
    }

    const qualifiers = this.getNormalizedQualifiers();
    const firstQualifier = String(qualifiers[0]).toLowerCase();
    if (PRERELEASES.has(firstQualifier)) {
      return this._qualifiers;  // non-normalized qualifier(s)
    }

    return null;
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
    let parts = version.replace(/\.$/, '').split('.');
    for (var i = 0; i < parts.length; i++) {
      let integer = parseInt(parts[i]);
      this._versions.push(isNaN(integer) ? parts[i] : integer);
    }
  }

  setQualifier(qualifier) {
    let dashSeparated = qualifier.split('-');
    for (var i = 0; i < dashSeparated.length; i++) {
      this.parseQualifier(dashSeparated[i]);
    }
  }

  parseQualifier(qualifier) {
    if (qualifier === '') {
      return;
    }

    let match = qualifier.match(INT_OR_DECIMAL_RE);
    if (match === null) {
      this.pushQualifier(qualifier);
    } else {
      this.addNextToken(qualifier, match.index === 0);
    }
  }

  addNextToken(qualifier, isNumber) {
    if (qualifier === '') {
      return;
    }
    // FIXME: what about qualifiers like `m8.1`?
    // if (qualifier.indexOf('.') !== -1) {
    //   this.pushQualifier(qualifier);
    //   return;
    // }
    let match = isNumber ?
      qualifier.match(STARTS_WITH_INT_OR_DECIMAL) :
      qualifier.match(/^\D+/);
    if (match === null) {
      return;
    }
    let element = qualifier.substring(0, match[0].length);
    this.pushQualifier(isNumber ? parseFloat(element) :
      // strip trailing separators ('.' / '-')
      element.replace(/[.-]$/, ''));
    this.addNextToken(qualifier.substring(element.length), !isNumber);
  }

  pushQualifier(qualifier) {
    if (TRIMMED_QUALIFIERS.indexOf(qualifier) >= 0) {
      return;
    }

    this._qualifiers.push(qualifier);
  }

  getVersionsAsText() {
    let result = [];
    for (var i = 0; i < this._versions.length; i++) {
      result.push(this._versions[i]);
      result.push('.');
    }
    result.pop();
    return result.join('');
  }

  getQualifiersAsText() {
    return this._getQualifiersAsText(this._qualifiers);
  }

  _getQualifiersAsText(qualifiers) {
    let result = [];
    for (var i = 0; i < qualifiers.length; i++) {
      result.push('-');
      result.push(qualifiers[i]);
    }
    return result.join('');
  }

  /**
   * see https://octopus.com/blog/maven-versioning-explained
   * and https://cwiki.apache.org/confluence/display/MAVENOLD/Versioning
   * for aliasing a1 -> alpha1 (but NOT a -> alpha)
   */
  getNormalizedQualifiers() {
    const qualifiers = this._qualifiers.slice();
    if (qualifiers.length === 0) {
      return [0];               // 0-pad empty qualifier
    }
    const [qualifier, version] = qualifiers.slice(0, 2);
    if (!isNaN(version) &&
      typeof qualifier === 'string' &&
      Object.prototype.hasOwnProperty.call(ALIASES, qualifier.toLowerCase())) {
      // replace ['a', 1] with ['alpha', 1], etc. See ALIASES above.
      qualifiers[0] = ALIASES[qualifier.toLowerCase()];
    } else if (typeof qualifier === 'string') {
      // handle cases like 1.2.3-m8.1. See FIXME in addNextToken
      // FIXME: we don't support `8.1` as a number, so any digit after the
      // first letters would do.
      const firstLetters = (qualifier.match(/^([a-z]+)[0-9]/i) || [])[1];
      if (typeof firstLetters === 'string' &&
        Object.prototype.hasOwnProperty.call(ALIASES, firstLetters.toLowerCase())) {
        qualifiers[0] = qualifiers[0].replace(
          firstLetters, ALIASES[firstLetters.toLowerCase()]);
      }
    }

    return qualifiers;
  }

  getQualifiersAsNormalizedText() {
    return this._getQualifiersAsText(this.getNormalizedQualifiers());
  }
}

function validateInput(input) {
  if (typeof input === 'undefined' ||
    typeof input !== 'string' ||
    input === null ||
    input === '' ||
    input === 'unknown' ||
    input.match(/[^\w.-]/) !== null) {
    return false;
  }
  // edge case: only dots and dashes
  let dotsAndDashes = input.match(/^(\W+)$/g);
  if (dotsAndDashes !== null && dotsAndDashes[0] === input) {
    return false;
  }
  return true;
}
