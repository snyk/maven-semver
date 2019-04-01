import test from 'ava';

import { compareRanges } from '../../';

test('compareRanges(r1, r2): smoke', t => {
  t.deepEqual(
    ['[3,4)', '(5,6]', '[1]', '[7]', '[1,2)', '(1,2)']
      .sort(compareRanges),
    ['[1]', '[1,2)', '(1,2)', '[3,4)', '(5,6]', '[7]']);
});

test('compareRanges(r1, r2): 0 if v1 == v2', t => {
  t.is(compareRanges('(1,2)', '(1,2)'), 0);
  t.is(compareRanges('(1,2]', '(1,2]'), 0);
  t.is(compareRanges('[1,2]', '[1,2]'), 0);
  t.is(compareRanges('[1,2)', '[1,2)'), 0);

  t.is(compareRanges('(1,)', '(1,)'), 0);
  t.is(compareRanges('[1,]', '[1,]'), 0);
  t.is(compareRanges('(,2)', '(,2)'), 0);
  t.is(compareRanges('[,2]', '[,2]'), 0);
  t.is(compareRanges('[,2)', '(,2)'), 0);

  t.is(compareRanges('(2)', '(2)'), 0);
  t.is(compareRanges('[2]', '[2]'), 0);

  t.is(compareRanges('[,)', '(,)'), 0);
});

test('compareRanges(r1, r2): -1 if v1 < v2', t => {
  t.is(compareRanges('[1,2)', '(1,2)'), -1);
  t.is(compareRanges('[1,)', '(1,)'), -1);
  t.is(compareRanges('[1,]', '(1,]'), -1);

  t.is(compareRanges('[1,2)', '[3,4)'), -1);
  t.is(compareRanges('(1,2)', '[3,4)'), -1);
  t.is(compareRanges('(1,2)', '(3,4)'), -1);
  t.is(compareRanges('[1,2)', '(3,4)'), -1);

  t.is(compareRanges('[3,4]', '[3,4)'), -1);

  t.is(compareRanges('[1,2)', '[1,3)'), -1);
  t.is(compareRanges('[1,2)', '(1,3)'), -1);

  t.is(compareRanges('[,2)', '(1,3)'), -1);
  t.is(compareRanges('(,2)', '(,3)'), -1);

  t.is(compareRanges('[1,2)', '[1,)'), -1);
  t.is(compareRanges('[1,2)', '[1,)'), -1);
  t.is(compareRanges('(1,2)', '(1,)'), -1);
  t.is(compareRanges('(1,2]', '(1,)'), -1);
  t.is(compareRanges('(1,2)', '(1,]'), -1);
  t.is(compareRanges('(1,2]', '(1,]'), -1);
  t.is(compareRanges('[2]', '[2,3)'), -1);
  t.is(compareRanges('[2]', '[3]'), -1);
  t.is(compareRanges('[2]', '[2,)'), -1);
  t.is(compareRanges('[2]', '(2,)'), -1);

});

test('compareRanges(r1, r2): 1 if v1 > v2', t => {
  t.is(compareRanges('[3,4)', '[1,2)'), 1);
  t.is(compareRanges('[3,4)', '(1,2)'), 1);
  t.is(compareRanges('(3,4)', '(1,2)'), 1);
  t.is(compareRanges('(3,4)', '[1,2)'), 1);

  t.is(compareRanges('[1,3)', '[1,2)'), 1);
  t.is(compareRanges('(1,2)', '[1,2)'), 1);
  t.is(compareRanges('(1,3)', '(1,2)'), 1);

  t.is(compareRanges('[3,4)', '[3,4]'), 1);

  t.is(compareRanges('[,2)', '(,1)'), 1);
  t.is(compareRanges('[1,2)', '(,3)'), 1);

  t.is(compareRanges('[2]', '(1,)'), 1);
  t.is(compareRanges('[3]', '[2]'), 1);
});
