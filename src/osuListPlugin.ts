import type MarkdownIt from 'markdown-it';

function removeAttribute(token: MarkdownIt.Token, attribute: string): void {
	token.attrs = token.attrs?.filter(([key]) => key !== attribute) ?? null;
}

const osuOrderedList: MarkdownIt.Core.RuleCore = (state) => {
	for (const token of state.tokens) {
		if (token.type !== 'ordered_list_open') {
			continue;
		}

		const startAttr = token.attrGet('start');
		let start = 0;

		if (startAttr !== null) {
			start = Number.parseInt(startAttr) - 1;
			removeAttribute(token, 'start');
		}

		token.attrSet('style', `--list-start: ${start}`);
	}
};

const osuListPlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_ordered_list', osuOrderedList);

	md.renderer.rules.list_item_open = () => '<li><div>';
	md.renderer.rules.list_item_close = () => '</div></li>';
};
export default osuListPlugin;
