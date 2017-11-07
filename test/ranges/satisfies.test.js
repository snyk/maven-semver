import test from 'ava';

import { satisfies } from '../../';

// satisfies(version, range): Return true if the version satisfies the range.

test('satisfies(version, range)', t => {
  t.true(satisfies('1.1', '[1.1,)'));

  t.false(satisfies('1.1.5', '1.1.2'));

  t.false(satisfies('1.1.5', '[1.1.2]'));
  t.true(satisfies('1.1.5', '1.1.5'));
  t.true(satisfies('1.4.11', '[1.3,1.5)'));
  t.true(satisfies('1.2.3', '[1.2,)'));
  t.true(satisfies('1.2.3', '(,1.0],[1.2,)'));
  t.true(satisfies('0.9.0', '(,1.0],[1.2,)'));
  t.false(satisfies('4.2.1', '[2.0.0,3)'));
  t.false(satisfies(
    '4.2.1', '[2.0.0,3),[3.0.0.RELEASE,3.1),[3.1.0.RELEASE,3.2)'));
  t.false(satisfies('4.2.1.RELEASE', '(4.1.0.RELEASE,4.2.0.RELEASE)'));

  t.false(satisfies('4.0.9.RELEASE', '[,2.5.6.SEC03)'));
  t.false(satisfies('4.0.9.RELEASE', '[,2.5.6.REC03)'));
  t.false(satisfies('4.0.9.RELEASE', '[2.5.7,2.5.7.SR023)'));
  t.false(satisfies('4.0.9.RELEASE', '[3,3.0.6)'));
  t.true(satisfies('3.2.7.RELEASE', '[3,3.2.9)'));

  t.false(satisfies(
    '4.0.9.RELEASE', '[,2.5.6.SEC03), [2.5.7,2.5.7.SR023), [3,3.0.6)'));
  t.true(satisfies('4.3.0.alpha', '[4.1.0,4.3.0]'));
  t.true(satisfies('4.1.0.Final', '[4.1.0,4.3.0]'));
  t.false(satisfies('4.1.0.beta', '[4.1.0,4.3.0]'));

  t.true(satisfies('4.3.0.GA', '[4.1.0,4.3.0]'));
  t.true(satisfies('4.3.0.Final', '[4.1.0,4.3.0]'));
  t.true(satisfies('4.3.0.RELEASE', '[4.1.0,4.3.0]'));
  t.false(satisfies('4.3.0.GA', '[4.1.0,4.3.0)'));

  // oddly enough, the spec says '1.2.1' satisfies 'nonsense'
  // but we break that, because it's not useful
  t.false(satisfies('1.2.1', 'nonsense'));
  t.true(satisfies('nonsense', 'nonsense'));

  t.false(satisfies('1.0', '[1.1,)'));
  t.false(satisfies('1.2', '1.1'));
  t.false(satisfies('1.5.2', '[1.3,1.5)'));
  t.false(satisfies('1.1.8', '(,1.0],[1.2,)'));

});
