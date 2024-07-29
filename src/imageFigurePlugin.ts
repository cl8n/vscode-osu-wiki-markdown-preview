// Forked from https://www.npmjs.com/package/@mdit/plugin-figure
import type MarkdownIt from 'markdown-it';

function getCaption(image: MarkdownIt.Token): string {
	const title = image.attrGet('title');
	return title ?? image.content;
}

const figure: MarkdownIt.Core.RuleCore = (state) => {
	// do not process first and last token
	for (let i = 1, { length } = state.tokens; i < length - 1; i++) {
		const token = state.tokens[i];

		if (token.type !== 'inline') continue;

		if (!token.children || (token.children.length !== 1 && token.children.length !== 3))
			// children: image alone, or link_open -> image -> link_close
			continue;

		if (token.children.length === 1 && token.children[0].type !== 'image')
			// one child, should be img
			continue;

		if (token.children.length === 3) {
			// three children, should be image enclosed in link
			const [childrenA, childrenB, childrenC] = token.children;
			const isEnclosed =
				childrenA.type !== 'link_open' ||
				childrenB.type !== 'image' ||
				childrenC.type !== 'link_close';

			if (isEnclosed) continue;
		}

		if (i !== 0 && state.tokens[i - 1].type !== 'paragraph_open')
			// prev token is paragraph open
			continue;

		if (i !== length - 1 && state.tokens[i + 1].type !== 'paragraph_close')
			// next token is paragraph close
			continue;

		// We have inline token containing an image only.
		// Previous token is paragraph open.
		// Next token is paragraph close.
		// Lets replace the paragraph tokens with figure tokens.
		const figure = state.tokens[i - 1];

		figure.type = 'figure_open';
		figure.tag = 'p';
		figure.attrSet('class', 'osu-md__figure-container');

		state.tokens[i + 1].type = 'figure_close';
		state.tokens[i + 1].tag = 'figure';

		// for linked images, image is one off
		const image = token.children.length === 1 ? token.children[0] : token.children[1];
		image.attrSet('class', 'osu-md__figure-image');

		const figCaption = getCaption(image);

		if (figCaption === '') continue;

		const openCaption = new state.Token('figcaption_open', 'em', 1);
		openCaption.attrSet('class', 'osu-md__figure-caption');

		const captionText = new state.Token('text', '', 0);
		captionText.content = figCaption;

		const closeCaption = new state.Token('figcaption_close', 'em', -1);

		token.children.push(openCaption, captionText, closeCaption);
	}
};

const imageFigurePlugin: MarkdownIt.PluginSimple = (md) => {
	md.core.ruler.before('linkify', 'figure', figure);
};
export default imageFigurePlugin;
