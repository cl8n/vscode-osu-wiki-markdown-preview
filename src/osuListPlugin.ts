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
	// TODO breaks vscode code line

	md.core.ruler.push('osu_ordered_list', osuOrderedList);

	md.renderer.rules.bullet_list_open = () => '<ul class="osu-md__list">';
	md.renderer.rules.ordered_list_open = () => '<ol class="osu-md__list osu-md__list--ordered">';
	md.renderer.rules.list_item_open = () => '<li class="osu-md__list-item"><div>';
	md.renderer.rules.list_item_close = () => '</div></li>';
};
export default osuListPlugin;
