export function createScriptExtractor(throwError) {
    // Finds and returns `<script>` element from the given DocumentFragment
    // fragmentDOM - JSDOM DocumentFragment
    // Returns JSDOM Element
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

export function getScriptSource(scriptTag) {
    return scriptTag.textContent;
}

export function createTemplatesExtractor(throwError) {
    // Finds and returns all `<template>` elements from the given DocumentFragment
    // fragmentDOM - JSDOM DocumentFragment
    // Returns an array of JSDOM Elements
    return function extractTemplates(fragmentDOM) {
        const templateTags = [...fragmentDOM.querySelectorAll('template')];

        if (!templateTags.length) {
            throwError('A file must have at least one template tag');
        }

        return templateTags;
    };
}

// Returns a pair of template ID and template content
export function getTemplateContent(templateElement) {
    return [
        templateElement.id || 'default',
        templateElement.innerHTML
    ];
}

// Returns a directory of template ID and template content
export function mapTemplateTags(templateElements) {
    return Object.fromEntries(
        templateElements.map(getTemplateContent)
    );
}
