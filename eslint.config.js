import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { rules } from '@lmcd/eslint-config';

export default defineConfig(globalIgnores([
	'dist/',
	'node_modules/',
]), pluginJs.configs.recommended, {
	rules,
	plugins: {
		'@stylistic': stylistic,
	},
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: {
			...globals.node,
			...globals.jest,
		},
	},
});
