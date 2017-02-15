import test from 'ava';

import { satisfies } from '../../';

// satisfies(version, range): Return true if the version satisfies the range.

test('satisfies(version, range)', t => {
  t.true(satisfies('1.1', '[1.1,)'));
  t.true(satisfies('1.1.5', '1.1.2'));
  t.false(satisfies('1.1.5', '[1.1.2]'));
  t.true(satisfies('1.1.5', '1.1.5'));
  t.true(satisfies('1.4.11', '[1.3,1.5)'));
  t.true(satisfies('1.2.3', '[1.2,)'));
  t.true(satisfies('1.2.3', '(,1.0],[1.2,)'));
  t.true(satisfies('0.9.0', '(,1.0],[1.2,)'));
  t.false(satisfies('4.2.1', '[2.0.0,3)'));
  t.false(satisfies('4.2.1', '[2.0.0,3),[3.0.0.RELEASE,3.1),[3.1.0.RELEASE,3.2)'));
  t.false(satisfies('4.2.1.RELEASE', '(4.1.0.RELEASE,4.2.0.RELEASE)'));
  // oddly enough, this is correct:
  t.true(satisfies('1.2.1', 'nonsense'));

  t.false(satisfies('1.0', '[1.1,)'));
  t.false(satisfies('1.5.2', '[1.3,1.5)'));
  t.false(satisfies('1.1.8', '(,1.0],[1.2,)'));

});
