import test from 'ava';
import jsdom from 'jsdom';

import * as Sfc from '../src/sfc.js';

const { fragment } = jsdom.JSDOM;

test('Script extractor', t => {
    const fragmentDOM = fragment(
        `<script>42</script>`
    );
    const scriptExtractor = Sfc.createScriptExtractor(
        (message) => { throw new Error(message); }
    );

    t.assert(typeof scriptExtractor === 'function', 'is function');

    const result = scriptExtractor(fragmentDOM);

    t.assert(typeof result === 'object', 'returns single object (node)');

    t.throws(
        () => scriptExtractor(fragment('')),
        { message: /must have exactly one/ },
        'throws when no script tag provided'
    );

    t.throws(
        () => scriptExtractor(fragment('<script></script><script></script>')),
        { message: /one script tag/ },
        'throws when more than one script tag provided'
    );
});

test('Templates extractor', t => {
    const templatesExtractor = Sfc.createTemplatesExtractor(
        (message) => { throw new Error(message); }
    );
    const oneTemplateDOM = fragment(
        `<template>42</template>`
    );

    t.assert(typeof templatesExtractor === 'function', 'is function');
    t.throws(
        () => templatesExtractor(fragment('')),
        { message: /must have at least one/ },
        'throws when no template tag provided'
    );

    const resultWithOneTemplate = templatesExtractor(
        oneTemplateDOM
    );

    t.assert(Array.isArray(resultWithOneTemplate), 'returns array');
    t.assert(typeof resultWithOneTemplate === 'object', 'array items are objects');

    const resultWithMultipleTemplates = templatesExtractor(
        fragment(
            `<template>42</template>
             <template>Whale</template>`
        )
    );

    t.assert(resultWithMultipleTemplates.length === 2, 'returns correct number of nodes');
});
