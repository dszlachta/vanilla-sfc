import templateModule from '@babel/template';
import parser from '@babel/parser';
import generator from '@babel/generator';
import t from '@babel/types';

const template = templateModule.default;
const generate = generator.default;
const { parse } = parser;

export function generateDictionaryOfStrings(sourceObject) {
    return t.objectExpression(
        Object.entries(sourceObject)
            .map(([key, value]) => t.objectProperty(
                t.identifier(key),
                t.stringLiteral(value)
            ))
    );
}

export function createGenerateTemplateExport(exportName) {
    const buildExport = template(`
        export function NAME() {
            return RETURN_VALUE;
        }
    `);

    return function generateTemplateExport(getReturnValue) {
        return buildExport({
            NAME: t.identifier(exportName),
            RETURN_VALUE: getReturnValue()
        });
    };
}

export function prependToModule(moduleSource, newContent) {
    const moduleProgram = [
        template.ast(moduleSource)
    ].flatMap(x => x);
    const newContentProgram = t.program([newContent]);

    return generate(t.program([
        ...newContentProgram.body,
        ...moduleProgram
    ])).code;
}
