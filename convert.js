import jsdom from 'jsdom';

import { pipe } from './functional.js';
import {
    createTemplatesExtractor,
    getScriptSource,
    mapTemplateTags,
    createScriptExtractor,
} from './sfc.js';
import {
    createGenerateTemplateExport,
    generateDictionaryOfStrings,
    prependToModule,
} from './module_manipulation.js';

const { fragment } = jsdom.JSDOM;

export const getTemplatesFunctionName = '_getTemplates';

const generateTemplateExport = createGenerateTemplateExport(getTemplatesFunctionName);

export function createConvert(filePath) {
    const throwError = (message) => {
        throw new Error(`In file: ${filePath}: ${message}`);
    };

    return function convert(content) {
        const fragmentDOM = fragment(content);

        const scriptSource = pipe(
            createScriptExtractor(throwError),
            getScriptSource
        )(fragmentDOM);

        const templateDictionary = pipe(
            createTemplatesExtractor(throwError),
            mapTemplateTags
        )(fragmentDOM);

        return prependToModule(
            scriptSource,
            generateTemplateExport(
                () => generateDictionaryOfStrings(templateDictionary)
            )
        );
    };
}
