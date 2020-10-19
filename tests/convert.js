import test from 'ava';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import parser from '@babel/parser';
import types from '@babel/types';

import { templatesGetterName } from '../index.js';
import { createConvert } from '../src/convert.js';

const { parse } = parser;

test('convert', t => {
    const content = readFileSync(join(
        dirname(fileURLToPath(import.meta.url)),
        './test.sfc'
    ));
    const convert = createConvert('test.sfc');
    const result = convert(content);

    t.assert(typeof result === 'string');

    const ast = parse(result, { sourceType: 'module' });
    const { body } = ast.program;

    const [
        generatedExport,
        ...scriptContent
    ] = body;

    t.assert(types.isExportNamedDeclaration(generatedExport), 'generated export is prepended');
    t.assert(types.isFunctionDeclaration(generatedExport.declaration), 'the export is a function');
    t.assert(generatedExport.declaration.id.name === templatesGetterName, 'the name is same as getTemplatesFunctionName');

    t.assert(types.isExpressionStatement(scriptContent[0]), 'script content follows');
    t.assert(scriptContent[0].expression.value === 'Here comes the fun');
});
