/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import VueIconsResolver from '@kalimahapps/vue-icons/resolver';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
	base: '/vue-options-to-composition',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	worker: {
		format: 'es',
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vue: ['vue'],
					eslint: ['eslint-linter-browserify'],
					shiki: ['shiki/core', 'shiki/wasm'],
					acorn: ['acorn'],
					vueIcons: ['@kalimahapps/vue-icons'],
				},
			},
		},
	},
	plugins: [
		vue(),
		AutoImport({
			// global imports to register
			imports: [
				// presets
				'vue',
			],
			eslintrc: {
				enabled: true,
				filepath: './.eslintrc-auto-import.json',
				globalsPropValue: true,
			},
		}),
		Components({
			resolvers: [VueIconsResolver],
		}),
	],
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text'],
		},
	},
});