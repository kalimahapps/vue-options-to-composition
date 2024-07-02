import jameelTheme from '@/jameel-color-theme.json';
import { createHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

/**
 * Highlight the output code
 *
 * @param  {string}          code Code to highlight
 * @return {Promise<string>}      Highlighted code
 */
const highlight = async function(code: string) : Promise<string>{
	const highlighter = await createHighlighterCore({
		themes: [jameelTheme],
		langs: [import('shiki/langs/javascript.mjs')],
		loadWasm: getWasm,
	});

	return highlighter.codeToHtml(code, {
		lang: 'javascript',
		theme: jameelTheme,
	});
};

export {
	highlight
};