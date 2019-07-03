import test from 'ava';

import { prerelease } from '../../';

// prerelease(v): Returns an array of prerelease components, or null if none
// exist. Example: prerelease('1.2.3-alpha.1') -> ['alpha', 1]

test('prerelease(v)', t => {
  t.deepEqual(prerelease('1.2.3.alpha'), ['alpha']);
  t.deepEqual(prerelease('1.2.3.alphaZ'), null);
  t.deepEqual(prerelease('1.2.3.alpha-1'), ['alpha', 1]);
  t.deepEqual(prerelease('1.2.3.alpha.1-2'), ['alpha', 1, 2]);
  t.deepEqual(prerelease('1.2.3-1'), null);
  t.deepEqual(prerelease('1.2.3-1.2'), null);

  t.is(prerelease('1'), null);
  t.is(prerelease('1.2'), null);
  t.is(prerelease('1.2.3'), null);
  t.is(prerelease('1.2.3.4'), null);
  t.is(prerelease('1.2.3.4.5'), null);

  t.is(prerelease('nonsense'), null);
  t.is(prerelease(''), null);
  t.is(prerelease(), null);
  t.is(prerelease(null), null);

  t.is(prerelease('1.2.3.Final'), null);
  t.is(prerelease('1.2.3-Final'), null);
  t.is(prerelease('1.2.3.GA'), null);
  t.is(prerelease('1.2.3-GA'), null);
  t.is(prerelease('1.2.3.RELEASE'), null);
  t.is(prerelease('1.2.3-RELEASE'), null);
  t.deepEqual(prerelease('1.2.3.RELEASE-1'), null);
  t.deepEqual(prerelease('1.2.3.RELEASE1'), null);
  t.is(prerelease('1.2.3.FINAL-RELEASE'), null);
  t.is(prerelease('1.2.3-other-random-qualifier'), null);


  t.deepEqual(prerelease('1.2.3-jre'), null);

  t.is(prerelease('1.2.3.SEC'), null);
  t.is(prerelease('1.2.3.SEC01'), null);
  t.deepEqual(prerelease('1.2.3.NONO-SEC01'), null);
  // TODO: these are not really "correct",
  //   but it's a vey edgy case - worth to handle?
  t.is(prerelease('1.2.3.SEC-ALPHA'), null);
  t.is(prerelease('1.2.3.SEC01-ALPHA'), null);

  t.deepEqual(prerelease('1.2.3.M1'), ['m', 1]); // FIXME: we lowercase all on input
  t.deepEqual(prerelease('1.2.3.Milestone12'), ['milestone', 12]);

  t.is(prerelease('1.2.3-rev2'), null);
  t.is(prerelease('1.2.3-rev20190712'), null);
  t.deepEqual(prerelease('1.2.3-rc'), ['rc']);
  t.deepEqual(prerelease('1.2.3-rc5'), ['rc', 5]);
  t.deepEqual(prerelease('1.2.3-rc.5'), ['rc', 5]);
  t.deepEqual(prerelease('1.2.3-cr'), null);
  t.deepEqual(prerelease('1.2.3-cr.9'), ['cr', 9]);

  t.deepEqual(prerelease('1.2.3-beta'), ['beta']);
  t.deepEqual(prerelease('1.2.3-beta8'), ['beta', 8]);
  t.deepEqual(prerelease('1.2.3-b8'), ['b', 8]);
  t.is(prerelease('1.2.3-b'), null);
  t.is(prerelease('1.2.3-release'), null);
  t.deepEqual(prerelease('1.2.3-nightly'), ['nightly']);
  t.deepEqual(prerelease('1.2.3-nightly10'), ['nightly', 10]);
  t.deepEqual(prerelease('1.2.3-nightly.10'), ['nightly', 10]);
  t.deepEqual(prerelease('1.2.3-incubating'), ['incubating']);
  t.deepEqual(prerelease('1.2.3-incubating20190404'), ['incubating', 20190404]);
  t.deepEqual(prerelease('1.2.3-incubating.20190404'), ['incubating', 20190404]);

  t.deepEqual(prerelease('1.2.3-preview'), ['preview']);
  t.deepEqual(prerelease('1.2.3-preview20190404'), ['preview', 20190404]);
  t.deepEqual(prerelease('1.2.3-preview.20190404'), ['preview', 20190404]);

  t.deepEqual(prerelease('1.2.3-snapshot'), ['snapshot']);
  t.deepEqual(prerelease('1.2.3-snapshot20190404'), ['snapshot', 20190404]);
  t.deepEqual(prerelease('1.2.3-snapshot.20190404'), ['snapshot', 20190404]);

  t.deepEqual(prerelease('1.2.3-ea'), ['ea']);
  t.deepEqual(prerelease('1.2.3-ea20190404'), ['ea', 20190404]);
  t.deepEqual(prerelease('1.2.3-ea.20190404'), ['ea', 20190404]);

  t.deepEqual(prerelease('1.2.3-pre'), ['pre']);
  t.deepEqual(prerelease('1.2.3-pre20190404'), ['pre', 20190404]);
  t.deepEqual(prerelease('1.2.3-pre.20190404'), ['pre', 20190404]);

  t.deepEqual(prerelease('1.2.3-test'), ['test']);
  t.deepEqual(prerelease('1.2.3-test20190404'), ['test', 20190404]);
  t.deepEqual(prerelease('1.2.3-test.20190404'), ['test', 20190404]);

  t.deepEqual(prerelease('1.2.3-beta.2'), ['beta', 2]);
  // FIXME: should be null
  t.deepEqual(prerelease('1.2.3-a023f79b'), ['a', 23, 'f', 79, 'b']);
});
