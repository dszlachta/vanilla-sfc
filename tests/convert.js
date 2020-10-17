import test from 'ava';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { createConvert } from '../convert.js';

test('convert', t => {
    const content = readFileSync(join(
        dirname(fileURLToPath(import.meta.url)),
        './test.sfc'
    ));
    const convert = createConvert('test.sfc');
    const result = convert(content);

    t.assert(typeof result === 'string');
});
