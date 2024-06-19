import test from 'ava';

import { compareStringsWithNumbers } from '../lib/utils';

test('compareStringsWithNumbers', t => {
    t.is(compareStringsWithNumbers('alpha11', 'alpha9'), 1);
    t.is(compareStringsWithNumbers('beta-1', 'alpha-1'), 1);
    t.is(compareStringsWithNumbers('beta1', 'alpha2'), 1);

    t.is(compareStringsWithNumbers('alpha9', 'alpha9'), 0);

    t.is(compareStringsWithNumbers('alpha9', 'alpha11'), -1);
    t.is(compareStringsWithNumbers('alpha-1', 'beta-1'), -1);
    t.is(compareStringsWithNumbers('alpha-2', 'beta-1'), -1);
    t.is(compareStringsWithNumbers('alpha2', 'beta1'), -1);
})