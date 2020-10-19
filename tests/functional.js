import test from 'ava';

import * as Functional from '../src/functional.js';

test('identity', t => {
    const object = {};

    t.is(Functional.identity(object), object, 'returns its own argument');
});

test('pipe', t => {
    const toUpper = s => s.toUpperCase();
    const removeSpaces = s => s.replace(/\s/, '_');
    const string = 'hello world';

    const result = Functional.pipe(
        s => toUpper(s),
        s => removeSpaces(s)
    )(string);

    const expected = removeSpaces(
        toUpper(string)
    );

    t.assert(result === expected, 'is producing valid output');
});
