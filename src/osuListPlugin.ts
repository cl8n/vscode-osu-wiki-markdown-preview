import type MarkdownIt from 'markdown-it';
import { getRenderRule, tokenAttrRemove } from './helpers';

const osuList: MarkdownIt.Core.RuleCore = (state) => {
	for (const token of state.tokens) {
		if (token.type === 'bullet_list_open') {
			token.attrJoin('class', 'osu-md__list');
			continue;
		}

		if (token.type === 'list_item_open') {
			token.attrJoin('class', 'osu-md__list-item');
			continue;
		}

		if (token.type !== 'ordered_list_open') {
			continue;
		}

		const startAttr = token.attrGet('start');
		let start = 0;

		if (startAttr !== null) {
			start = Number.parseInt(startAttr, 10) - 1;
			tokenAttrRemove(token, 'start');
		}

		token.attrJoin('class', 'osu-md__list osu-md__list--ordered');
		token.attrJoin('style', `--list-start: ${start};`);
	}
};

const osuListPlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_list', osuList);

	const originalListItemOpen = getRenderRule(md, 'list_item_open');
	const originalListItemClose = getRenderRule(md, 'list_item_close');

	md.renderer.rules.list_item_open = (...args) => (
		`${originalListItemOpen(...args)}<div>`
	);
	md.renderer.rules.list_item_close = (...args) => (
		`</div>${originalListItemClose(...args)}`
	);
};
export default osuListPlugin;
