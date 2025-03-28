const parseRange = require('./range-parser');
const parseVersion = require('./version-parser');
const { compareStringsWithNumbers } = require('./utils');

module.exports = {
  gt,
  gte,
  lt,
  lte,
  eq,
  neq,
  cmp,
  compare,
  rcompare,
  compareRanges,
  diff,
};

function gt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) === 1) {
    return true;
  }
  if (versionCompare === 1) {
    return true;
  }
  return false;
}

function gte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) !== -1) {
    return true;
  }
  if (versionCompare === 1) {
    return true;
  }
  return false;
}

function lt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) === -1) {
    return true;
  }
  if (versionCompare === -1) {
    return true;
  }
  return false;
}

function lte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0 && compareQualifiers(semver1, semver2) !== 1) {
    return true;
  }
  if (versionCompare === -1) {
    return true;
  }
  return false;
}

function eq(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  return (compareVersions(semver1, semver2) === 0 &&
    compareQualifiers(semver1, semver2) === 0);
}

function neq(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  return (compareVersions(semver1, semver2) !== 0 ||
    compareQualifiers(semver1, semver2) !== 0);
}

function cmp(v1, comparator, v2) {
  switch (comparator) {
    case '>': {
      return gt(v1, v2);
    }
    case '>=': {
      return gte(v1, v2);
    }
    case '<': {
      return lt(v1, v2);
    }
    case '<=': {
      return lte(v1, v2);
    }
    case '==': {
      return eq(v1, v2);
    }
    case '!=': {
      return neq(v1, v2);
    }
    case '===': {
      return strictEq(v1, v2);
    }
    case '!==': {
      return !strictEq(v1, v2);
    }
    default: {
      throw new Error(`Invalid comparator: ${comparator}`);
    }
  }
}

function strictEq(v1, v2) {
  return parseVersion(v1).getAsText() === parseVersion(v2).getAsText();
}

function compare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if (versionCompare === 0) {
    if (allVersionsZero(semver1)) {
      if (containsNoSpecials(v1) && containsNoSpecials(v2)) {
        // compare full semver as strings to cover case of semver containing leading zeros in qualifier
        // happens in real world even though spec says "Numeric identifiers MUST NOT include leading zeroes"
        return compareStrings(v1, v2)
      }
    }
    return compareQualifiers(semver1, semver2);
  }
  return versionCompare;
}

function rcompare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver2, semver1);
  if (versionCompare === 0) {
    return compareQualifiers(semver2, semver1);
  }
  return versionCompare;
}

function compareVersions(semver1, semver2) {
  let v1 = semver1.getVersions();
  let v2 = semver2.getVersions();

  const v1AsTimestamp = v1.length > 0 ? looksLikeTimestamp(v1[0]) : undefined;
  const v2AsTimestamp = v2.length > 0 ? looksLikeTimestamp(v2[0]) : undefined;

  if (v1AsTimestamp === undefined && v2AsTimestamp !== undefined) {
    return 1;
  }

  if (v1AsTimestamp !== undefined && v2AsTimestamp === undefined) {
    return -1;
  }

  if (v1AsTimestamp !== undefined && v2AsTimestamp !== undefined) {
    const v1Time = v1AsTimestamp.getTime();
    const v2Time = v2AsTimestamp.getTime();
    if (v1Time == v2Time) {
      return 0;
    } else if (v1Time > v2Time) {
      return 1;
    } else if (v1Time < v2Time) {
      return -1;
    }
  }

  let max = v1.length > v2.length ? v1.length : v2.length;
  for (var i = 0; i < max; i++) {
    if ((v1[i] || 0) < (v2[i] || 0)) {
      return -1;
    }
    if ((v1[i] || 0) > (v2[i] || 0)) {
      return 1;
    }
  }
  return 0;
}

function looksLikeTimestamp(n) {
  // YYYYMMDDHHMMSS
  if (n > 2000_00_00_00_00_00 && n < 2100_00_00_00_00_00) {
    const seconds = n % 100;
    const minutes = Math.trunc(n / 100) % 100;
    const hours = Math.trunc(n / 100_00) % 100;
    const days = Math.trunc(n / 100_00_00) % 100;
    const months = Math.trunc(n / 100_00_00_00) % 100;
    const year = Math.trunc(n / 100_00_00_00_00);
    if (
      seconds >= 0 &&
      seconds <= 59 &&
      minutes >= 0 &&
      minutes <= 59 &&
      hours >= 0 &&
      hours <= 23 &&
      days >= 1 &&
      days <= 31 &&
      months >= 1 &&
      months <= 12
    ) {
      return new Date(year, months, days, hours, minutes, seconds);
    }
  }

  // YYYYMMDDHHMM
  if (n > 2000_00_00_00_00 && n < 2100_00_00_00_00) {
    const minutes = n % 100;
    const hours = Math.trunc(n / 100) % 100;
    const days = Math.trunc(n / 100_00) % 100;
    const months = Math.trunc(n / 100_00_00) % 100;
    const year = Math.trunc(n / 100_00_00_00);
    if (
      minutes >= 0 &&
      minutes <= 59 &&
      hours >= 0 &&
      hours <= 23 &&
      days >= 1 &&
      days <= 31 &&
      months >= 1 &&
      months <= 12
    ) {
      return new Date(year, months, days, hours, minutes, 0);
    }
  }

  // YYYYMMDDHH
  if (n > 2000_00_00_00 && n < 2100_00_00_00) {
    const hours = n % 100;
    const days = Math.trunc(n / 100) % 100;
    const months = Math.trunc(n / 100_00) % 100;
    const year = Math.trunc(n / 100_00_00);
    if (
      hours >= 0 &&
      hours <= 23 &&
      days >= 1 &&
      days <= 31 &&
      months >= 1 &&
      months <= 12
    ) {
      return new Date(year, months, days, hours, 0, 0);
    }
  }

  // YYYYMMDD
  if (n > 2000_00_00 && n < 2100_00_00) {
    const days = n % 100;
    const months = Math.trunc(n / 100) % 100;
    const year = Math.trunc(n / 100_00);
    if (days >= 1 && days <= 31 && months >= 1 && months <= 12) {
      return new Date(year, months, days, 0, 0, 0);
    }
  }

  return undefined;
}

function containsNoSpecials(v) {
  // subset of SPECIALS to allow zeros and elements in git commit sha
  const specialWords = ["alpha", "beta", "milestone", "snapshot"]
  for (let i = 0; i < specialWords.length; i++){
    if (v && v.indexOf(specialWords[i]) > 0 ) return false
  }
  return true
}

// "alpha" < "beta" < "milestone" < "rc" = "cr" < "snapshot" <
// "" = "final" = "ga" < "sp" < (other strings, like "a")
const SPECIALS = {
  alpha: 0,
  beta: 1,
  milestone: 2,
  rc: 3,
  snapshot: 4,
  0: 5,                     // "", final, ga
  sp: 6,
};

function allVersionsZero(semver){
  const v = semver.getVersions();
  for (let i = 0; i < v.length; i++) {
    if (v[i] > 0) return false
  }
  return true
}

function compareStrings(q1, q2) {
  if (q1 > q2) {
    return 1;
  }
  if (q1 < q2) {
    return -1;
  }
  return 0;
}

function compareQualifiers(semver1, semver2) {
  let q1 = semver1.getNormalizedQualifiers();
  let q2 = semver2.getNormalizedQualifiers();

  if (JSON.stringify(q1) === JSON.stringify(q2)) {
    return 0;
  }

  const q1Special = Object.prototype.hasOwnProperty.call(SPECIALS, q1[0]);
  const q2Special = Object.prototype.hasOwnProperty.call(SPECIALS, q2[0]);

  if (q1Special && q2Special) {
    if (q1[0] !== q2[0]) {
      return SPECIALS[q1[0]] > SPECIALS[q2[0]] ? 1 : -1;
    }
    // same special qualifier - try again without it (recursively)
    // FIXME: implement. is the string equality below good enough?
  }

  // q1 = ["alpha", 1], q2 = ["myversion", 0]
  if (q1Special && !q2Special) {
    return -1;                  // q2 > q1
  }

  if (!q1Special && q2Special) {
    return 1;                  // q2 < q1
  }

  q1 = semver1.getQualifiersAsNormalizedText();
  q2 = semver2.getQualifiersAsNormalizedText();
  return compareStringsWithNumbers(q1, q2);
}

function diff(version1, version2) {
  if (eq(version1, version2)) { return null; }

  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);

  const types = ['major', 'minor', 'patch'];
  const length = Math.max(v1._versions.length, v2._versions.length);

  if (v1._qualifiers.length || v2._qualifiers.length) {
    for (let i = 0; i < length; i++) {
      if (v1._versions[i] !== v2._versions[i]) {
        return 'pre' + (types[i] || 'patch');
      }
    }
    return 'prerelease';
  }
  for (let i = 0; i < length; i++) {
    if (v1._versions[i] !== v2._versions[i]) {
      return types[i] || 'patch';
    }
  }
  return null;
}

function compareRanges(range1, range2) {
  const c1 = parseRange(range1).getComponents();
  const c2 = parseRange(range2).getComponents();

  if (1 !== c1.length || 1 !== c2.length) {
    throw new Error('singular ranges only');
  }

  const r1 = c1[0];
  const r2 = c2[0];

  const lower = compare(r1.minOperand, r2.minOperand);

  const lowerOpen = comp(r1, r2, lower, r => undefined === r.minOperand);
  if (0 !== lowerOpen) {
    return lowerOpen;
  }

  if (0 !== lower) {
    return lower;
  }

  const single = comp(r1, r2, lower, r => '==' === r.minOperator);
  if (0 !== single) {
    return single;
  }

  if (r1.minOperator !== r2.minOperator) {
    if ('>' === r1.minOperator) {
      return 1;
    }
    return -1;
  }

  const upper = compare(r1.maxOperand, r2.maxOperand);

  const upperOpen = -comp(r1, r2, -upper, r => undefined === r.maxOperand);
  if (0 !== upperOpen) {
    return upperOpen;
  }

  if (0 !== upper) {
    return upper;
  }

  if (r1.maxOperator === r2.maxOperator) {
    return 0;
  }

  if ('<' === r1.maxOperator) {
    return 1;
  }

  return -1;
}

function comp(left, right, ifBoth, map) {
  const l = map(left);
  const r = map(right);

  if (l && r) {
    return ifBoth;
  }

  if (!l && r) {
    return 1;
  }

  if (l && !r) {
    return -1;
  }

  // !l && !r
  return 0;
}
