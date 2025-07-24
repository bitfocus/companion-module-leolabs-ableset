import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({
	enableTypescript: true,
	ignores: ['scripts/', 'node_modules/'],
	commonRules: {
		'n/no-missing-import': 'off',
	},
	typescriptRules: {
		'@typescript-eslint/no-base-to-string': 'off',
	},
})
