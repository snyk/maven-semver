const parseRange = require('./range-parser');
const parseVersion = require('./version-parser');

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

function compareQualifiers(semver1, semver2) {
  let q1 = semver1.getQualifiersAsText();
  let q2 = semver2.getQualifiersAsText();

  // remove the leading dash so "sec" will be bigger than all other qualifiers
  if (q1.indexOf('-sec') === 0) { q1 = q1.slice(1); }
  if (q2.indexOf('-sec') === 0) { q2 = q2.slice(1); }

  if (q1.length > 0 && q2.length === 0) {
    return q1.indexOf('sec') === 0 ? 1 : -1;
  }
  if (q2.length > 0 && q1.length === 0) {
    return q2.indexOf('sec') === 0 ? -1 : 1;
  }

  if (q1 > q2) {
    return 1;
  }
  if (q1 < q2) {
    return -1;
  }
  return 0;
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
