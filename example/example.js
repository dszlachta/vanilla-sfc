import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
    readFileSync,
    writeFileSync
} from 'fs';
import convert, { templatesGetterName } from '../index.js';

const directoryName = dirname(fileURLToPath(import.meta.url));
const filePath = join(directoryName, './example.sfc');
const outputFilePath = join(directoryName, './output.js');

export default async function convertExampleFile() {
    // Convert SFC and save the result, so we can import() them
    const file = readFileSync(filePath);
    const converted = convert(filePath)(file);

    writeFileSync(outputFilePath, converted);

    // Import the output module and call our "component"
    const output = await import(outputFilePath);
    const component = output.default;
    const templates = output[templatesGetterName]();

    return component(templates.default, 'Hello');
}
