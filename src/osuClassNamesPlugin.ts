import type MarkdownIt from 'markdown-it';
import { getRenderRule, tokenAttrRemove } from './helpers';

const osuClassNames: MarkdownIt.Core.RuleCore = (state) => {
	for (const token of state.tokens) {
		if (token.type === 'heading_open') {
			token.attrJoin('class', 'osu-md__header');
			token.attrJoin('class', `osu-md__header--${token.tag.slice(1)}`);
		}

		if (token.type === 'paragraph_open') {
			token.attrJoin('class', 'osu-md__paragraph');
		}

		if (token.type === 'td_open' || token.type === 'th_open') {
			token.attrJoin('class', 'osu-md__table-data');

			const style = token.attrGet('style');
			const styleMatch = style?.match(/^text-align:(center|left|right)$/);

			if (styleMatch != null) {
				tokenAttrRemove(token, 'style');
				token.attrJoin('class', `osu-md__table-data--${styleMatch[1]}`);
				token.attrSet('align', styleMatch[1]);
			}

			if (token.type === 'th_open') {
				token.attrJoin('class', 'osu-md__table-data--header');
			}
		}
	}
}

const osuClassNamesPlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_class_names', osuClassNames);

	const originalTableOpen = getRenderRule(md, 'table_open');
	const originalTableClose = getRenderRule(md, 'table_close');

	md.renderer.rules.table_open = (...args) => (
		`<div class="osu-md__table">${originalTableOpen(...args)}`
	);
	md.renderer.rules.table_close = (...args) => (
		`${originalTableClose(...args)}</div>`
	);
};
export default osuClassNamesPlugin;
