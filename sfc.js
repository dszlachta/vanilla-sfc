import jsdom from 'jsdom';

const { fragment } = jsdom.JSDOM;

export const getTemplatesFunctionName = '_getTemplates';

export function createScriptExtractor(throwError) {
    return function extractScript(fragmentDOM) {
        const scriptTags = [...fragmentDOM.querySelectorAll('script')];

        const scriptTagPresent = Boolean(scriptTags.length);
        const multipleScriptTagsPresent = scriptTags.length > 1;

        if (!scriptTagPresent) {
            throwError('A file must have exactly one script tag');
        }

        if (multipleScriptTagsPresent) {
            throwError(
                'Only one script tag per file is supported. However, you may provide multiple template tags'
            );
        }

        return scriptTags[0];
    };
}

export function wrapIntoExportedFunction(name, returnValue) {
    return `export const ${name} = () => ${returnValue}`;
}

export function createAppendToScript(contentToBeAppended) {
    return function appendToScript(scriptContent) {
        return [
            wrapIntoExportedFunction(
                getTemplatesFunctionName,
                contentToBeAppended
            ),
            scriptContent
        ].join('\n');
    };
}

export function createTemplatesExtractor(throwError) {
    return function extractTemplates(fragmentDOM) {
        const templateTags = [...fragmentDOM.querySelectorAll('template')];

        if (!templateTags.length) {
            throwError('A file must have at least one template tag');
        }

        return templateTags;
    };
}

// export function toJavaScript(filePath) {
//     const throwError = (message) => {
//         throw new Error(`In file: ${filePath}: ${message}`);
//     };

//     const extractScript = createScriptExtractor(throwError);

//     // TODO: rename it
//     return function inner(content) {
//         const contentDOM = fragment(content);





//         // TODO: add: only 1 default validation
//         const templateDictionary = Object.fromEntries(
//             templateTags.map(templateTag => [
//                 templateTag.id || 'default',
//                 templateTag.innerHTML
//             ])
//         );

//         const scriptTagContent = scriptTags[0].textContent;

//         return [
//             scriptTagContent,
//             `export _getTemplates = () => ${JSON.stringify(templateDictionary)};`;
//         ].join('\n');
//     };
// }
