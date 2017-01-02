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
  diff: () => { throw new Error('Not implemented'); },
};

function gt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  if(compareVersions(semver1, semver2) === 1) {
    return true;
  }
  if(compareQualifiers(semver1, semver2) === 1) {
    return true;
  }
  return false;
}

function gte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if(versionCompare === 1) {
    return true;
  } else if(versionCompare === -1) {
    return false;
  }
  if(compareQualifiers(semver1, semver2) !== -1) {
    return true;
  }
  return false;
}

function lt(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  if(compareVersions(semver1, semver2) === -1) {
    return true;
  }
  if(compareQualifiers(semver1, semver2) === -1) {
    return true;
  }
  return false;
}

function lte(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if(versionCompare === -1) {
    return true;
  } else if(versionCompare === 1) {
    return false;
  }
  if(compareQualifiers(semver1, semver2) !== 1) {
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
    case '>':
      return gt(v1, v2);
    case '>=':
      return gte(v1, v2);
    case '<':
      return lt(v1, v2);
    case '<=':
      return lte(v1, v2);
    case '==':
      return eq(v1, v2);
    case '!=':
      return neq(v1, v2);
    case '===':
      return _strictEq(v1, v2);
    case '!==':
      return !_strictEq(v1, v2);
    default:
      throw new Error(`Invalid comparator: ${comparator}`);
  }
}

function _strictEq(v1, v2) {
  return parseVersion(v1).getAsText() === parseVersion(v2).getAsText();
}

function compare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver1, semver2);
  if(versionCompare === 0) {
    return compareQualifiers(semver1, semver2);
  }
  return versionCompare;
}

function rcompare(v1, v2) {
  let semver1 = parseVersion(v1);
  let semver2 = parseVersion(v2);
  let versionCompare = compareVersions(semver2, semver1);
  if(versionCompare === 0) {
    return compareQualifiers(semver2, semver1);
  }
  return versionCompare;
}

function diff(v1, v2) {
}

function compareVersions(semver1, semver2) {
  let v1 = semver1.getVersions();
  let v2 = semver2.getVersions();
  let max = v1.length > v2.length ? v1.length : v2.length;
  for(var i = 0; i < max; i++) {
    if((v1[i] || 0) < (v2[i] || 0)) {
      return -1;
    } else if((v1[i] || 0) > (v2[i] || 0)) {
      return 1;
    }
  }
  return 0;
}

function compareQualifiers(semver1, semver2) {
  let q1 = semver1.getQualifiersAsText();
  let q2 = semver2.getQualifiersAsText();
  if(q1 > q2) {
    return 1;
  } else if(q1 < q2) {
    return -1;
  }
  return 0;
}
