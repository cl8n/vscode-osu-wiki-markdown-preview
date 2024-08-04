import type MarkdownIt from 'markdown-it';

const osuParagraph: MarkdownIt.Core.RuleCore = (state) => {
	for (const token of state.tokens) {
		if (token.type === 'paragraph_open') {
			token.attrJoin('class', 'osu-md__paragraph');
		}
	}
}

const osuParagraphPlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.push('osu_paragraph', osuParagraph);
};
export default osuParagraphPlugin;
