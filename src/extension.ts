import type MarkdownIt from 'markdown-it';
import containerPlugin from 'markdown-it-container';
import footnotePlugin from 'markdown-it-footnote';
import commentSkipPlugin from './commentSkipPlugin';
import imageFigurePlugin from './imageFigurePlugin';
import osuClassNamesPlugin from './osuClassNamesPlugin';
import osuFlagPlugin from './osuFlagPlugin';
import osuFootnotePlugin from './osuFootnotePlugin';
import osuListPlugin from './osuListPlugin';
import osuMainPagePlugin from './osuMainPagePlugin';
import osuModifierPlugin from './osuModifierPlugin';

export function activate() {
	return {
		extendMarkdownIt(md: MarkdownIt): MarkdownIt {
			return md
				.use(commentSkipPlugin)
				.use(containerPlugin, 'infobox', {
					render: (tokens, idx, options, _env, self) => {
						if (tokens[idx].nesting === 1) {
							tokens[idx].attrJoin('class', 'osu-md__infobox');
						}

						return self.renderToken(tokens, idx, options);
					},
					validate: (params) => {
						return params.trim().split(' ', 2)[0].toLowerCase() === 'infobox';
					},
				} as containerPlugin.ContainerOpts)
				.use(imageFigurePlugin)
				.use(footnotePlugin)
				.use(osuFootnotePlugin)
				.use(osuListPlugin)
				.use(osuFlagPlugin)
				.use(osuClassNamesPlugin)
				.use(osuMainPagePlugin)
				.use(osuModifierPlugin);
		},
	};
}
