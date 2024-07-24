import type MarkdownIt from 'markdown-it';

export default function osuModifierPlugin(md: MarkdownIt): void {
	const originalRender = md.renderer.render;

	// TODO: Apply a news class instead if viewing a news article
	md.renderer.render = (...args) => (
		`<div class="osu-md osu-md--wiki">${originalRender.apply(md.renderer, args)}</div>`
	);
}
