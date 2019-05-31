import test from 'ava';

import { compare } from '../../';

// compare(v1, v2): Return 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is
// greater. Sorts in ascending order if passed to Array.sort().

// see https://octopus.com/blog/maven-versioning-explained for the edge cases like
// 1.1.0.1-alpha < 1.1.0.1-a while 1.1.0.1-alpha1 == 1.1.0.1-a1

// see also https://cwiki.apache.org/confluence/display/MAVENOLD/Versioning for
// additional test cases

test('compare(v1, v2): 0 if v1 == v2', t => {
  t.is(compare('1', '1'), 0);
  t.is(compare('1.1', '1.1'), 0);
  t.is(compare('1.1.0', '1.1.0'), 0);
  t.is(compare('1.1.0.1', '1.1.0.1'), 0);
  t.is(compare('1.1.0.1-alpha', '1.1.0.1-alpha'), 0);
  t.is(compare('1.1.0.1-alpha', '1.1.0.1-ALPHA'), 0);
  t.is(compare('1.1.0.1-alpha.2', '1.1.0.1-Alpha.2'), 0);
  t.is(compare('1.1.0.Final', '1.1.0'), 0);
  t.is(compare('1.1.0-GA', '1.1.0'), 0);
  t.is(compare('1.1.0.RELEASE', '1.1.0'), 0);
  t.is(compare('1.1.0-jre', '1.1.0'), 0);

  t.is(compare('1.1.0.1-alpha1', '1.1.0.1-a1'), 0);
  t.is(compare('1.0-alpha1', '1.0-a1'), 0);
  t.is(compare('1.0-beta1', '1.0-b1'), 0);
  t.is(compare('1.0-milestone1', '1.0-m1'), 0);
  t.is(compare('1.0-rc1', '1.0-cr1'), 0);

  // testSeparators
  t.is(compare('1.0alpha1', '1.0-a1'), 0);
  t.is(compare('1.0alpha-1', '1.0-a1'), 0);
  t.is(compare('1.0beta1', '1.0-b1'), 0);
  t.is(compare('1.0beta-1', '1.0-b1'), 0);
  t.is(compare('1.0milestone1', '1.0-m1'), 0);
  t.is(compare('1.0milestone-1', '1.0-m1'), 0);
  t.is(compare('1.0rc1', '1.0-cr1'), 0);
  t.is(compare('1.0rc-1', '1.0-cr1'), 0);
  t.is(compare('1.0ga', '1.0'), 0);
  // testUnequalSeparators
  t.not(compare('1.0alpha.1', '1.0-a1'), 0);

  t.is(compare('1.0MILESTONE1', '1.0-m1'), 0);
  t.is(compare('1.0RC1', '1.0-cr1'), 0);

  // testLongVersions
  t.is(compare('1.0.0.0.0.0.0', '1'), 0);
  t.is(compare('1.0.0.0.0.0.0x', '1x'), 0);

  /**
   * FIXME: dots not supported
   * // testDashAndPeriod
   * t.is(compare('1-0.ga', '1.0'), 0);
   * t.is(compare('1.0-final', '1.0'), 0);
   * t.is(compare('1-0-ga', '1.0'), 0);
   * t.is(compare('1-0-final', '1-0'), 0);
   * t.is(compare('1-0', '1.0'), 0);
   */
});

test('compare(v1, v2): 1 if v1 > v2', t => {
  t.is(compare('2', '1'), 1);
  t.is(compare('1.2', '1.1'), 1);
  t.is(compare('1.1.1', '1.1.0'), 1);
  t.is(compare('1.1.0.2', '1.1.0.1'), 1);
  t.is(compare('1.1.1', '1.1.1.beta'), 1);
  t.is(compare('1.1.0.1-beta', '1.1.0.1-alpha'), 1);
  t.is(compare('1.1.0.1-alpha.3', '1.1.0.1-alpha.2'), 1);
  t.is(compare('1.1.1.Final', '1.1.0'), 1);
  t.is(compare('1.1.0.1-GA', '1.1.0.beta'), 1);
  t.is(compare('1.1.1.RELEASE', '1.1.0'), 1);
  t.is(compare('1.1.1-jre', '1.1.0'), 1);
});

test('compare(v1, v2): -1 if v1 < v2', t => {
  t.is(compare('1', '2'), -1);
  t.is(compare('1.1', '1.2'), -1);
  t.is(compare('1.1.0', '1.1.1'), -1);
  t.is(compare('1.1.0.1', '1.1.0.2'), -1);
  t.is(compare('1.1.0.1-alpha', '1.1.0.1-beta'), -1);
  t.is(compare('1.1.0.1-alpha.2', '1.1.0.1-alpha.3'), -1);
  t.is(compare('1.1.1.Final', '1.1.2'), -1);
  t.is(compare('1.1.0.1-GA', '1.1.2.beta'), -1);
  t.is(compare('1.1.1.RELEASE', '1.1.2'), -1);
  t.is(compare('1.1.1-jre', '1.1.2'), -1);

  // alpha1 == a1, alpha < a
  t.is(compare('1.1.0.1-alpha', '1.1.0.1-a'), -1);
  // testing qualifiers only
  t.is(compare('SomeRandomVersionOne', 'SOMERANDOMVERSIONTWO'), -1);
  t.is(compare('SomeRandomVersionThree', 'SOMERANDOMVERSIONTWO'), -1);

});

test('sort with compare - edge cases', t => {
  const VERSIONS = [
    "1.0-alpha",
    // "1.0a1-SNAPSHOT",  FIXME: we don't recurse on qualifiers
    "1.0-alpha1",
    // "1.0beta1-SNAPSHOT", FIXME: we don't recurse on qualifiers
    "1.0-b2",
    // FIXME: we don't recurse on the qualifiers nor support dots
    // "1.0-beta3.SNAPSHOT",
    "1.0-beta3",
    "1.0-milestone1-SNAPSHOT",
    "1.0-m2",
    // "1.0-rc1-SNAPSHOT", FIXME: we don't recurse on qualifiers
    "1.0-rc0",
    "1.0-cr1",
    "1.0-SNAPSHOT",
    "1.0",
    "1.0-sp",
    "1.0-a",
    // "1.0-RELEASE", FIXME: see TRIMMED_QUALIFIERS in lib/version-parser.js
    "1.0-whatever",
    "1.0.z",
    "1.0.1",
    "1.0.1.0.0.0.0.0.0.0.0.0.0.0.1",
  ];

  const sortedArray = VERSIONS.slice();
  sortedArray.sort(compare);
  t.deepEqual(sortedArray, VERSIONS);
});
