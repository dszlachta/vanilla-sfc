import test from 'ava';
import convertExampleFile from '../example/example.js';

const expectedResult = `
    <div class="component">
        Hello
    </div>
`.trim();

test('example', async t => {
    const result = await convertExampleFile();

    t.assert(result.trim() === expectedResult, 'produces correct output');
});
