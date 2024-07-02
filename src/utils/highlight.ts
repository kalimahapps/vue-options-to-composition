import { codeToHtml } from 'shiki'
import jameelTheme from '@/jameel-color-theme.json';

/**
 * Highlight the output code
 *
 * @param  {string}          code Code to highlight
 * @return {Promise<string>}      Highlighted code
 */
const highlight = async function(code: string) : Promise<string>{
	return await codeToHtml(code, {lang: 'javascript', theme: jameelTheme});
};

export {
	highlight
};