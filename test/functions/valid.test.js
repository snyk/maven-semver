import test from 'ava';

import { valid } from '../../';

// valid(v): Return the parsed version, or null if it's not valid.

test('valid(v)', t => {
  t.is(valid(null), '');
  t.is(valid(''), '');
  t.is(valid('.'),'');
  t.is(valid('.-.'),'');

  t.is(valid('1'), '1');
  t.is(valid('1.1'), '1.1');
  t.is(valid('1.1.2'), '1.1.2');
  t.is(valid('1.1.2.3'), '1.1.2.3');

  t.is(valid('1.1.2-4'), '1.1.2-4');
  t.is(valid('1.2-12-alpha-4'), '1.2-12-alpha-4');
  t.is(valid('1.2-12alpha-4'), '1.2-12-alpha-4');
  t.is(valid('1.2-alpha34-4'), '1.2-alpha-34-4');
  t.is(valid('1.2alpha34-4'), '1.2-alpha-34-4');

  t.is(valid('1.2alpha34BEtA4'), '1.2-alpha-34-beta-4');

  // t.is(valid('1'), '1');
  // t.is(valid('1.1'), '1.1');
  // t.is(valid('1.1.2'), '1.1.2');
  // t.is(valid('1.1.2.3'), '1.1.2.3');
  // t.is(valid('1.1.2-4'), '1.1.2-4');
  // t.is(valid('1.1.2.pre.4'), '1.1.2.pre.4');

  // t.is(valid('1alpha'), '1-alpha');
  // t.is(valid('1.1alpha'), '1.1-alpha');
  // t.is(valid('1.1alpha2'), '1.1-alpha-2');

  // t.is(valid('nonsense'), null);
  // t.is(valid(''), null);
  // t.is(valid(null), null);
  // t.is(valid(), null);
});
