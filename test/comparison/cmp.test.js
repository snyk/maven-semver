import test from 'ava';
import combos from 'combos';

import { cmp } from '../../';

// cmp(v1, comparator, v2): Pass in a comparison string, and it'll call the
// corresponding function above. "===" and "!==" do simple string comparison,
// but are included for completeness.
// Throws if an invalid comparison string is provided.

test('cmp(v1, ">", v2)', t => {
  t.truthy(cmp('2', '>', '1'));
  t.falsy(cmp('2', '>', '2'));
  t.falsy(cmp('1', '>', '2'));
});

test('cmp(v1, ">=", v2)', t => {
  t.truthy(cmp('2', '>=', '1'));
  t.truthy(cmp('2', '>=', '2'));
  t.falsy(cmp('1', '>=', '2'));
});

test('cmp(v1, "<", v2)', t => {
  t.truthy(cmp('1', '<', '2'));
  t.falsy(cmp('2', '<', '2'));
  t.falsy(cmp('2', '<', '1'));
});

test('cmp(v1, "<=", v2)', t => {
  t.truthy(cmp('1', '<=', '2'));
  t.truthy(cmp('2', '<=', '2'));
  t.falsy(cmp('2', '<=', '1'));
  // https://octopus.com/blog/maven-versioning-explained
  t.truthy(cmp('1-SNAPSHOT', '<=', '1'));
  t.falsy(cmp('1', '<=', '1-SNAPSHOT'));

  t.truthy(cmp('1', '<=', '1-a'));

  // FIXME: no support for dots. add `'1.{}'` to see the errors
  const templates = ['1-{}', '1{}'];
  const alphas = ['alpha1', 'Alpha1', 'ALPHA1', 'a1', 'A1', 'a-1', 'alpha-1'];
  const betas = ['beta1', 'Beta1', 'BETA1', 'b1', 'B1', 'b-1', 'beta-1'];

  const alphaVersObjs = combos({ ver: templates, qualifier: alphas });
  const alphaVers = alphaVersObjs.map(x => x.ver.replace('{}', x.qualifier));
  const betaVersObjs = combos({ ver: templates, qualifier: betas });
  const betaVers = betaVersObjs.map(x => x.ver.replace('{}', x.qualifier));
  const alphaBetaPairsObjs = combos({ alpha: alphaVers, beta: betaVers });
  alphaBetaPairsObjs.forEach(o => {
    t.truthy(cmp(o.alpha, "<=", o.beta));
    t.falsy(cmp(o.beta, "<=", o.alpha));
  });
});

test('cmp(v1, "==", v2)', t => {
  t.truthy(cmp('2', '==', '2'));
  t.truthy(cmp('2', '==', '2.0'));
  t.falsy(cmp('2', '==', '1'));
});

test('cmp(v1, "!=", v2)', t => {
  t.truthy(cmp('2', '!=', '1'));
  t.falsy(cmp('2', '!=', '2'));
  t.falsy(cmp('2', '!=', '2.0'));
});

test('cmp(v1, "===", v2)', t => {
  t.truthy(cmp('2', '===', '2'));
  t.falsy(cmp('2', '===', '1'));
  t.falsy(cmp('2', '===', '2.0'));
});

test('cmp(v1, "!==", v2)', t => {
  t.falsy(cmp('2', '!==', '2'));
  t.truthy(cmp('2', '!==', '2.0'));
  t.truthy(cmp('2', '!==', '1'));
});

test('cmp(v1, "nonsense", v2)', t => {
  t.throws(() => cmp('2', 'nonsense', '2'), 'Invalid comparator: nonsense');
  t.throws(() => cmp('2', '!====', '2'), 'Invalid comparator: !====');
  t.throws(() => cmp('2', '>broken', '2'), 'Invalid comparator: >broken');
});
