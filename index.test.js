import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import svgo from 'svgo';
import Vinyl from 'vinyl';
import compiler from './index.js';

/**
 * Normalises newlines and trims whitespace from the beginning and
 * end of the provided string or buffer.
 *
 * @param {string|Buffer} input
 */
const normalise = input => {
	return input.toString().replace(/[\r\n]+/gu, '\n').trim();
};

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} svgContents
 */
const compile = (svgContents, options) => {
	const file = new Vinyl({
		cwd: __dirname,
		base: __dirname,
		path: path.join(__dirname, 'test.svg'),
		contents: Buffer.from(svgContents),
	});

	return new Promise((resolve, reject) => {
		const stream = compiler(svgo, options).on('error', error => {
			reject(error);
		});

		stream.write(file);
		stream.end(() => {
			resolve(file);
		});
	});
};

describe('Parsing SVGs', () => {
	test('Does not change invalid files', async () => {
		const file = await compile(`<svg</svg>`);

		expect(normalise(file.contents)).toBe(`<svg</svg>`);
	});

	test('Compiles and preserves whitespace', async () => {
		const input = fs.readFileSync(path.join(__dirname, 'tests', 'test.svg'), 'utf-8');
		const expected = svgo.optimize(input, {});
		const file = await compile(input);

		expect(normalise(file.contents)).toBe(normalise(expected.data));
	});

	test('Does nothing on empty files', async () => {
		const file = await compile(``);

		expect(normalise(file.contents)).toBe(``);
	});
});

describe('normalise()', () => {
	test('Trims', () => {
		const a = ' test\r\nline\r\n ';

		expect(normalise(a)).toBe('test\nline');
	});
});
