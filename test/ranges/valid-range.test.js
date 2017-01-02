import test from 'ava';

import { validRange } from '../../';

// validRange(range): Return the valid range or null if it's not valid

test('validRange(range)', t => {
  t.deepEqual(validRange('(1.0,]'), [['>', '1.0']]);
  t.deepEqual(validRange('1.0'), [['>=', '1.0']]);
  t.deepEqual(validRange('[1.0]'), [['==', '1.0']]);
  t.deepEqual(validRange('[1.2,1.3]'), [['>=', '1.2', '<=', '1.3']]);
  t.deepEqual(validRange('[1.0,2.0)'), [['>=', '1.0', '<', '2.0']]);
  t.deepEqual(validRange('[1.5,)'), [['>=', '1.5']]);
  t.deepEqual(validRange('(,1.0],[1.2,)'), [['<=', '1.0'], ['>=', '1.2']]);
  t.deepEqual(validRange('(,1.1),(1.1,)'), [['<', '1.1'], ['>', '1.1']]);


  t.deepEqual(validRange('[1.0,)'), [['>=', '1.0']]);
  t.deepEqual(validRange('(,1.0]'), [['<=', '1.0']]);
  t.deepEqual(validRange('(1.0,2.0]'), [['>', '1.0', '<=', '2.0']]);

  // t.deepEqual(validRange('(1.0'), []);
  // t.deepEqual(validRange('[1.0'), []);
  // t.deepEqual(validRange('1.0)'), []);
  // t.deepEqual(validRange('1.0]'), []);

  // t.is(validRangeRange(''), '>= 0');
  // t.is(validRangeRange(), null);
  // t.is(validRangeRange('nonsense'), null);
});
