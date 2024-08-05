import type MarkdownIt from 'markdown-it';

const osuClassNames: MarkdownIt.Core.RuleCore = (state) => {
	for (const token of state.tokens) {
		if (token.type === 'heading_open') {
			token.attrJoin('class', 'osu-md__header');
			token.attrJoin('class', `osu-md__header--${token.tag.slice(1)}`);
		}

		if (token.type === 'paragraph_open') {
			token.attrJoin('class', 'osu-md__paragraph');
		}
	}
}

const osuClassNamesPlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_class_names', osuClassNames);
};
export default osuClassNamesPlugin;
