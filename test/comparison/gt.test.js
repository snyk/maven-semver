import test from 'ava';

import { gt } from '../../';

test('gt(v1, v2): v1 > v2', t => {
  t.truthy(gt('2.0-SEC01', '2.0'));
  t.truthy(gt('2.0-SEC02', '2.0-SEC01'));
  t.truthy(gt('2.0-ZORO', '2.0-SEC01'));
  t.truthy(gt('2.1-alpha', '2.0-SEC01'));
  t.truthy(gt('2.0-SECURITY01', '2.0'));
  t.truthy(gt('2.0-NOT-SEC01', '2.0'));

  t.truthy(gt('2', '1'));
  t.truthy(gt('5.4', '5.3'));
  t.truthy(gt('5.0.1', '5.0.0'));
  t.truthy(gt('5.0.1.52', '5.0.1.34'));
  t.truthy(gt('5.0.1.52.200', '5.0.1.52.176'));
  t.truthy(gt('5.0.1-beta.3', '5.0.1-beta.1'));
  t.truthy(gt('1.12.0-alpha11', '1.12.0-alpha9'));
  t.truthy(gt('5.0.1-beta', '5.0.1-alpha'));
  t.truthy(gt('5.0.1', '5.0.1.beta'));
  t.truthy(gt('5.0.1.GA', '5.0.1.rc'));
  t.truthy(gt('5.0.1-jre', '5.0.1.rc'));
  t.truthy(gt('5.0.1-jre', '5.0.1-ga'));

  // NuGet preview support
  t.truthy(gt('8.0.0', '8.0.0-preview'));
  t.truthy(gt('8.0.0', '8.0.0-preview.1'));
  t.truthy(gt('8.0.0-preview', '8.0.0-alpha'));
  t.truthy(gt('8.0.0-preview', '8.0.0-beta'));
  t.truthy(gt('8.0.0-preview.2', '8.0.0-preview.1'));

  t.falsy(gt('2', '2'));
  t.falsy(gt('5.4', '5.4'));
  t.falsy(gt('5.0.1', '5.0.1'));
  t.falsy(gt('5.0.1.52', '5.0.1.52'));
  t.falsy(gt('5.0.1.52.200', '5.0.1.52.200'));
  t.falsy(gt('5.0.1-beta.3', '5.0.1-beta.3'));
  t.falsy(gt('5.0.1-beta', '5.0.1-beta'));
  t.falsy(gt('5.0.1-ga', '5.0.1-ga'));

  t.falsy(gt('1', '2'));
  t.falsy(gt('5.3', '5.4'));
  t.falsy(gt('5.0.0', '5.0.1'));
  t.falsy(gt('5.0.1.34', '5.0.1.52'));
  t.falsy(gt('5.0.1.52.176', '5.0.1.52.200'));
  t.falsy(gt('5.0.1-beta.1', '5.0.1-beta.3'));
  t.falsy(gt('5.0.1-alpha', '5.0.1-beta'));
  t.falsy(gt('5.0.1.beta', '5.0.1'));
  t.falsy(gt('5.0.1-ga', '5.0.2'));
  t.falsy(gt('5.0.1-ga', '5.0.1-sec01'));
  t.falsy(gt('5.0.1-jre', '5.0.2'));
  t.truthy(gt('5.0.1-jre', '5.0.1-sec01'));

  // NuGet preview - falsy cases
  t.falsy(gt('8.0.0-preview', '8.0.0'));
  t.falsy(gt('8.0.0-preview.1', '8.0.0'));
  t.falsy(gt('8.0.0-alpha', '8.0.0-preview'));
  t.falsy(gt('8.0.0-beta', '8.0.0-preview'));
  t.falsy(gt('8.0.0-preview.1', '8.0.0-preview.2'));
});
