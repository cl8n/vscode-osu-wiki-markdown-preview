import type MarkdownIt from 'markdown-it';
import containerPlugin from 'markdown-it-container';
import footnotePlugin from 'markdown-it-footnote';
import commentSkipPlugin from './commentSkipPlugin';
import imageFigurePlugin from './imageFigurePlugin';
import osuFlagPlugin from './osuFlagPlugin';
import osuFootnotePlugin from './osuFootnotePlugin';
import osuListPlugin from './osuListPlugin';
import osuModifierPlugin from './osuModifierPlugin';
import osuParagraphPlugin from './osuParagraphPlugin';

export function activate() {
	return {
		extendMarkdownIt(md: MarkdownIt): MarkdownIt {
			return md
				.set({ html: false })
				.use(commentSkipPlugin)
				.use(containerPlugin, 'Infobox')
				.use(imageFigurePlugin)
				.use(footnotePlugin)
				.use(osuFootnotePlugin)
				.use(osuListPlugin)
				.use(osuFlagPlugin)
				.use(osuModifierPlugin)
				.use(osuParagraphPlugin);
		},
	};
}
