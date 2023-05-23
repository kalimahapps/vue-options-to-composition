import { getHighlighter, toShikiTheme } from 'shiki-es';
import jameelTheme from '@/jameel-color-theme.json';

/**
 * Highlight the output code
 *
 * @param  {string}          code Code to highlight
 * @return {Promise<string>}      Highlighted code
 */
const highlight = async function(code: string) : Promise<string>{
	const highlighter = await getHighlighter({
		theme: toShikiTheme(jameelTheme),
	});

	return highlighter.codeToHtml(code, { lang: 'js' });
};

export {
	highlight
};