import test from 'ava';

import { validRange } from '../../';

// validRange(range): Return the valid range or null if it's not valid

test('validRange(range)', t => {
  t.deepEqual(validRange('(1.0,]'), [{
    minOperator: '>',
    minOperand: '1.0'
  }]);
  t.deepEqual(validRange('1.0'), [{
    minOperator: '>=',
    minOperand: '1.0'
  }]);
  t.deepEqual(validRange('[1.0]'), [{
    minOperator: '==',
    minOperand: '1.0'
  }]);
  t.deepEqual(validRange('[1.2,1.3]'), [{
    minOperator: '>=',
    minOperand: '1.2',
    maxOperator: '<=',
    maxOperand: '1.3'
  }]);
  t.deepEqual(validRange('[1.0,2.0)'), [{
    minOperator: '>=',
    minOperand: '1.0',
    maxOperator: '<',
    maxOperand: '2.0'
  }]);
  t.deepEqual(validRange('[1.5,)'), [{
    minOperator: '>=',
    minOperand: '1.5'
  }]);
  t.deepEqual(validRange('(,1.0],[1.2,)'), [{
    maxOperator: '<=',
    maxOperand: '1.0'
  }, {
    minOperator: '>=',
    minOperand: '1.2'
  }]);
  t.deepEqual(validRange('(,1.1),(1.1,)'), [{
    maxOperator: '<',
    maxOperand: '1.1'
  }, {
    minOperator: '>',
    minOperand: '1.1'
  }]);

  t.deepEqual(validRange('[1.0,)'), [{
    minOperator: '>=',
    minOperand: '1.0'
  }]);
  t.deepEqual(validRange('(,1.0]'), [{
    maxOperator: '<=',
    maxOperand: '1.0'
  }]);
  t.deepEqual(validRange('(1.0,2.0]'), [{
    minOperator: '>',
    minOperand: '1.0',
    maxOperator: '<=',
    maxOperand: '2.0'
  }]);

  t.deepEqual(validRange('(1.0'), []);
  t.deepEqual(validRange('[1.0'), []);
  t.deepEqual(validRange('1.0)'), []);
  t.deepEqual(validRange('1.0]'), []);
});
