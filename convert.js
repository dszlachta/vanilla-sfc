import jsdom from 'jsdom';

import { pipe } from './functional.js';
import {
    createScriptExtractor,
    createTemplatesExtractor,
    getScriptSource,
    mapTemplateTags,
} from './sfc.js';
import {
    createGenerateTemplatesExport,
    generateDictionaryOfStrings,
    prependToModule,
} from './module_manipulation.js';

const { fragment } = jsdom.JSDOM;

export const templatesGetterName = '__v_sfc_getTemplates';

const generateTemplatesExport = createGenerateTemplatesExport(templatesGetterName);

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
            generateTemplatesExport(
                () => generateDictionaryOfStrings(templateDictionary)
            )
        );
    };
}
