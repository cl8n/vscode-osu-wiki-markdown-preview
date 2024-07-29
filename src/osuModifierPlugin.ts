import type MarkdownIt from 'markdown-it';

const osuModifierPlugin: MarkdownIt.PluginSimple = (md) => {
	const originalRender = md.renderer.render;

	// TODO: Apply a news class instead if viewing a news article
	md.renderer.render = (...args) => (
		`<div class="osu-md osu-md--wiki">${originalRender.apply(md.renderer, args)}</div>`
	);
};
export default osuModifierPlugin;
