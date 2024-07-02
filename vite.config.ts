/// <reference types="vitest" />
import path from 'node:path';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import inheritAttrs from 'vite-plugin-vue-setup-inherit-attrs';
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
        format: "es",
    },
	plugins: [
		vue(),
		inheritAttrs(),
		chunkSplitPlugin(),
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
			reporter: ['text'],
		},
	},
});