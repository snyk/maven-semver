import test from 'ava';
// import combos from 'combos';
import fs from 'fs'

const semverArr = JSON.parse(fs.readFileSync('/Users/shiri.viner/Learning/Semver/maven-semver/test/comparison/upstreamSemverArrV2.json'));

// import { cmp } from '../../';
import { validateInput } from '../../lib/version-parser';

// cmp(v1, comparator, v2): Pass in a comparison string, and it'll call the
// corresponding function above. "===" and "!==" do simple string comparison,
// but are included for completeness.
// Throws if an invalid comparison string is provided.

test('cmp(v1, ">", v2)', t => {
  t.truthy(validateInput('11.0.4'));
  
  semverArr.forEach(ver => {
    if (ver) {
      if (!validateInput(ver.trim())) {
        console.log(ver);
      }
    }
  });
});
