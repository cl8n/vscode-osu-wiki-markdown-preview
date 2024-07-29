import type MarkdownIt from 'markdown-it';
import containerPlugin from 'markdown-it-container';
import footnotePlugin from 'markdown-it-footnote';
import commentSkipPlugin from './commentSkipPlugin';
import osuFlagPlugin from './osuFlagPlugin';
import osuFootnotePlugin from './osuFootnotePlugin';
import osuModifierPlugin from './osuModifierPlugin';

export function activate() {
	return {
		extendMarkdownIt(md: MarkdownIt): MarkdownIt {
			return md
				.set({ html: false })
				.use(commentSkipPlugin)
				.use(containerPlugin, 'Infobox')
				.use(footnotePlugin)
				.use(osuFlagPlugin)
				.use(osuFootnotePlugin)
				.use(osuModifierPlugin);
		},
	};
}
