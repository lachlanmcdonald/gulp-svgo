import chalk from 'chalk';
import path from 'node:path';
import { Transform } from 'node:stream';
import PluginError from 'plugin-error';

const PLUGIN_NAME = 'gulp-svgo';

const transformer = transform => {
	const stream = new Transform({
		objectMode: true,
	});

	// eslint-disable-next-line no-underscore-dangle
	stream._transform = transform;

	return stream;
};

const Plugin = (svgo, options) => {
	if (typeof svgo.optimize !== 'function') {
		throw new Error('The provided instance of SVGO does not export an optimize() method.');
	}

	// svgo does not export SvgoParserError, so we'll trigger an
	// error and then use the constructor for future checks.
	let SvgoParserError;

	try {
		svgo.optimize('</svg>');
	} catch (e) {
		SvgoParserError = e.constructor;
	}

	return transformer((file, _encoding, callback) => {
		// Ignore null files
		if (file.isNull()) {
			return callback(null, file);
		}

		// Streams are not supported
		if (file.isStream()) {
			return callback(new PluginError(PLUGIN_NAME, 'Streams not supported!'));
		}

		// Ignore empty files
		if (file.contents.length === 0) {
			return callback(null, file);
		}

		try {
			const result = svgo.optimize(file.contents.toString('utf-8'), {
				input: 'file',
				path: file.path,
				removeViewBox: false,
				...options,
			});

			file.contents = Buffer.from(result.data);

			return callback(null, file);
		} catch (e) {
			if (e instanceof SvgoParserError) {
				const relativePath = path.relative(process.cwd(), file.path);
				const pad = ' '.repeat(PLUGIN_NAME.length + 2);

				const message = [
					`${ chalk.bold(PLUGIN_NAME) }: ${ chalk.yellow(e.reason) }`,
					`${ pad }${ chalk.whiteBright('Path') }: ${ relativePath }`,
					`${ pad }${ chalk.whiteBright('Line') }: ${ e.line }`,
					`${ pad }${ chalk.whiteBright('Column') }: ${ e.column }`,
				].join('\n');

				process.stderr.write(message + '\n');

				return callback(null, file);
			} else {
				return callback(PluginError(PLUGIN_NAME, e));
			}
		}
	});
};

export default Plugin;
