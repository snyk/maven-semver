import test from 'ava';

import { intersects } from '../../';

// intersects(range1, range2): Return true if the two ranges intersect.

test('intersects(range1, range2)', t => {
  // all ranges
  t.true(intersects('[0.1]', '(,)'), 'all');

  // single range
  t.true(intersects('[1]', '[1,)'), 'single');
  t.true(intersects('[1]', '(,2)'), 'single encapsulated max');
  t.false(intersects('[1]', '(,1)'), 'single not encapsulated max');
  t.true(intersects('[2]', '[1,)'), 'single encapsulated min');

  // right intersection
  t.true(intersects('(0,1]', '[1,10)'), 'intersect on right');
  t.false(intersects('[0.1, 5)', '[5,)'), 'no intersect on right');
  t.false(intersects('(0.1.5, 0.2.5]', '(0.2.5,)'));

  // left intersection
  t.true(intersects('[10,11]', '(1,10]'), 'intersect on left');
  t.false(intersects('(2, 3]', '(0.1,2]'), 'no intersect on left');

  // ranges contain one another
  t.true(intersects('[1,10]', '[5,6]'), 'ranges contain one another');
  t.true(intersects('[2,6]', '[1,5)'), 'ranges contain one another');

  // // complex boundaries
  t.false(intersects('(,1)', '(2,)'), 'open bounds not intersecting');
  t.true(intersects('(2, 3]', '(0.1,2],[3,4)'), 'intersect multiple boundaries right');
  t.true(intersects('(1, 5], [7, 9]', '(6, 7]'), 'intersect multiple boundaries left');
  t.false(intersects('(1, 5], [7, 9]', '(6, 7), (9, 10]'), 'no intersect with multiple boundaries');
  t.false(intersects('[0.0.0, 1.0.0)', '[2.0.0, )'), 'no intersect when open bounded');
  t.true(intersects('[2.0.0, )', '[1.0.0, 3.0.0]'), 'open bounded intersects containing range');
  t.false(intersects('[1.0.0, )', '[0.0.0, 1.0.0)'), 'open bounded touches exclusive upper bound');
  t.false(intersects('[, 1.0.0)', '[2.0.0, )'), 'no intersect when first and second open bounded');
  t.true(intersects('[, 2.0.0)', '[1.0.0, )'), 'intersect when first and second open bounded');
});
