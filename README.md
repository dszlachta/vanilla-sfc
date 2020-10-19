Vanilla SFC (Single File Component)
===================================

Use this package to extract `<template>` and `<script>` tags from a single file.
Vanilla SFC is heavily inspired by Vue's `*.vue` files, although (as the name suggests) it is framework-agnostic.
**Only ES modules are supported!** This package *always* expects and produces ES module.

Usage
-----

```
import convert from 'vanilla-sfc';

const filePath = 'path/to/file.sfc';
const fileContent = getFileContent(filePath);

const resultSource = convert(filePath)(fileContent);
```

`resultSource` is a string representation (source code) of newly generated module.
The module starts with exported named function that can be used to get templates dictionary (read below)
and then the content of the `<script>` tag follows.

Supported SFC format
--------------------

The format supported by this package differs from the one handled by Vue:
- Multiple `<template>` tags in one file are supported (but should use `id` to provide identifiers)
- Template tags can have multiple children
- `<style>` tag is not supported at the moment
- Only one `<script>` tag per file is supported

Example of a correct vanilla SFC:

```
<template>
    <h1>Default template</h1>
    <span>
        The first template does not need id attribute. It will be simply named "default".
    </span>
</template>

<template id="error">
    <div class="big red">
        Oh no, an error happened
    </div>
</template>

<script>
    // This can be anything you wish, as long as it is a valid ES module.
    // We will export a function by default, as an example

    export default function myComponent() {

    }
</script>
```

Accessing the templates dictionary
----------------------------------

```
import { getTemplatesFunctionName } from 'vanilla-sfc';

async function loadComponent(pathToConvertedOutputFile) {
    const module = await import(pathToConvertedOutputFile);

    const templatesById = module[templatesGetterName]();

    // ...
}
```

After converting the above example SFC file, `templatesById` would have this format:

```
{
    default: '<h1>Default template</h1>\n<span>...',
    error: '<div class="big red">...'
}
```

Vanilla SFC do not perform any template interpolation at the moment. You would need
another package to interpolate strings like `{{ someVariable }}`.

How does it work?
-------------

After a file is read, `jsdom` is used to find all of the needed tags. Then, the template dictionary
is produced and the content of the `<script>` tag is extracted. A new module is generated by following
these steps:
1. Create named export with the name matching `templatesGetterName` constant and a function returning template
dictionary as the exported value
2. Insert the content of the `<script>` tag

Module generation is done using the excellent [Babel.js tooling](https://babeljs.io/docs/en/babel-generator).

Please note that ES modules cannot be evaluated using `eval` and `new Function`.
