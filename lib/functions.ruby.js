const GemVersion = require('./generated').GemVersion;

module.exports = {
  valid,
  prerelease,
  major,
  minor,
  patch,
  inc: () => { throw new Error('Not implemented'); },
}

function valid(v) {
  if (!v) { return null; }

  try {
    return GemVersion.$create(v).$to_s();
  } catch (err) {
    return null;
  }
}

function prerelease(v) {
  try {
    const version = GemVersion.$create(v);
    if (version['$prerelease?']()) {
      const segments = version.$segments();
      const preStartIndex = segments.findIndex(s => /[a-zA-Z]/.test(s));
      return segments.slice(preStartIndex);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

function _segmentAt(v, index) {
  try {
    return GemVersion.$create(v).$segments()[index] || null;
  } catch(err) {
    return null;
  }
}

function major(v) {
  return _segmentAt(v, 0);
}

function minor(v) {
  return _segmentAt(v, 1);
}

function patch(v) {
  return _segmentAt(v, 2);
}
