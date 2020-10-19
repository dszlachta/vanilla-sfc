import templateModule from '@babel/template';
import parser from '@babel/parser';
import generator from '@babel/generator';
import t from '@babel/types';

import { identity } from './functional.js';

const template = templateModule.default;
const generate = generator.default;
const { parse } = parser;

// Turns `sourceObject` into Babel's ObjectExpression node to produce
// a dictionary: { key: value }
// Returns AST
export function generateDictionaryOfStrings(sourceObject) {
    return t.objectExpression(
        Object.entries(sourceObject)
            .map(([key, value]) => t.objectProperty(
                t.identifier(key),
                t.stringLiteral(value)
            ))
    );
}

// Returns a function that performs code generation.
// `exportName` - name for the export (string)
export function createGenerateTemplatesExport(exportName) {
    const buildExport = template(`
        export function NAME() {
            return RETURN_VALUE;
        }
    `);

    // Generates the above export.
    // `getReturnValue` - function returning Babel's Statement node
    // Returns AST
    return function generateTemplatesExport(getReturnValue) {
        return buildExport({
            NAME: t.identifier(exportName),
            RETURN_VALUE: getReturnValue()
        });
    };
}

// Creates a new module source code containing `newContent` (at the
// beginning) and `moduleSource`.
// `moduleSource` - the original source code (string)
// `newContent` - AST of code to prepend (AST)
// Returns a string.
export function prependToModule(moduleSource, newContent) {
    const moduleProgram = [
        template.ast(moduleSource)
    ].flatMap(identity);

    const newContentProgram = t.program([newContent]);

    return generate(t.program([
        ...newContentProgram.body,
        ...moduleProgram
    ])).code;
}
