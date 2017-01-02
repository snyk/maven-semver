import test from 'ava';

import { validRange } from '../../';

// validRange(range): Return the valid range or null if it's not valid

test('validRange(range)', t => {
  t.deepEqual(validRange('1.0'), ['=>', '1.0']);
  t.deepEqual(validRange('[1.0]'), ['==', '1.0']);
  // t.deepEqual(validRange('(1.0,]'), ['>', '1.0']);
  // t.deepEqual(validRange('(,1.0]'), ['<=', '1.0']);
  // t.deepEqual(validRange('(1.0,2.0]'), ['>', '1.0', '<=', '2.0']);

  // t.is(validRange('(1.0'), null);
  // t.is(validRange('[1.0'), null);
  // t.is(validRange('1.0)'), null);
  // t.is(validRange('1.0]'), null);

  // t.is(validRangeRange('1.1'), '= 1.1');
  // t.is(validRangeRange('~> 1.1'), '< 2, >= 1.1');
  // t.is(validRangeRange('~> 1.1.0'), '< 1.2, >= 1.1.0');
  // t.is(validRangeRange('~> 1.1.1.0'), '< 1.1.2, >= 1.1.1.0');
  // t.is(validRangeRange('~> 1.1.1.beta.1'), '< 1.2, >= 1.1.1.beta.1');
  // t.is(validRangeRange('> 2.1, < 2.4'), '< 2.4, > 2.1');

  // t.is(validRangeRange(''), '>= 0');
  // t.is(validRangeRange(), null);
  // t.is(validRangeRange('nonsense'), null);
});
