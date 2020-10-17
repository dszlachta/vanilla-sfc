import jsdom from 'jsdom';

import {
    createScriptExtractor,
    createTemplatesExtractor,
    getScriptSource,
    mapTemplateTags
} from './sfc.js';
import {
    generateDictionaryOfStrings,
    createGenerateTemplateExport,
    prependToModule
} from './module_manipulation.js';

const { fragment } = jsdom.JSDOM;

export const getTemplatesFunctionName = '_getTemplates';

export function createConvert(filePath) {
     const throwError = (message) => {
         throw new Error(`In file: ${filePath}: ${message}`);
     };

    return function convert(content) {
        const fragmentDOM = fragment(content);
        const scriptTagExtractor = createScriptExtractor(throwError);
        const templatesExtractor = createTemplatesExtractor(throwError);
        const generateTemplateExport = createGenerateTemplateExport(getTemplatesFunctionName);

        const scriptTag = scriptTagExtractor(fragmentDOM);
        const templateTags = templatesExtractor(fragmentDOM);

        const scriptSource = getScriptSource(scriptTag);
        const templateDictionary = mapTemplateTags(templateTags);

        return prependToModule(
            scriptSource,
            generateTemplateExport(
                () => generateDictionaryOfStrings(templateDictionary)
            )
        );
    };
}
