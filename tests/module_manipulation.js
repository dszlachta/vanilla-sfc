import test from 'ava';
import types from '@babel/types';
import parser from '@babel/parser';

const { parse } = parser;

import * as ModuleManipulation from '../module_manipulation.js';

test('generateDictionaryOfStrings', t => {
    const dictionary = ModuleManipulation.generateDictionaryOfStrings(
        {
            key1: 'a',
            key2: 'b'
        }
    );

    t.assert(types.isObjectExpression(dictionary));
});

test('createGenerateTemplateExport', t => {
    const generateTemplateExport = ModuleManipulation.createGenerateTemplateExport('someName');
    const returnValue = () => types.numericLiteral(42);

    const result = generateTemplateExport(returnValue);

    t.assert(types.isExportNamedDeclaration(result));
});

test('prependToModule', t => {
    const moduleSource = 'function notPrepended() {}';
    const contentToPrepend = types.variableDeclaration('var', [
        types.variableDeclarator(
            types.identifier('prepended'),
            types.booleanLiteral(true)
        )
    ]);

    const code = ModuleManipulation.prependToModule(moduleSource, contentToPrepend);
    const ast = parse(code);

    t.assert(types.isVariableDeclaration(ast.program.body[0]), 'prepends new content');
});
