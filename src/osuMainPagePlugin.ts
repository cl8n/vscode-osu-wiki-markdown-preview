import type MarkdownIt from 'markdown-it';

const osuMainPage: MarkdownIt.Core.RuleCore = (state) => {
	if (state.env.osuLayout !== 'main_page') {
		return;
	}

	for (const token of state.tokens) {
		if (token.type === 'heading_open') {
			token.attrJoin('class', 'wiki-main-page__heading');
		}

		if (token.type === 'link_open') {
			token.attrJoin('class', 'wiki-main-page__link');
		}

		if (token.type === 'paragraph_open') {
			token.attrJoin('class', 'wiki-main-page__paragraph');
		}
	}
}

const osuMainPagePlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_main_page', osuMainPage);
};
export default osuMainPagePlugin;
