import type MarkdownIt from 'markdown-it';
import frontMatterPlugin from 'markdown-it-front-matter';

const osuModifierPlugin: MarkdownIt.PluginSimple = (md) => {
	// This part is a hack to change the parser environment based on front matter.
	//
	// - Use the callback from the front matter plugin to set a bound variable in this scope
	// - Add a parser rule directly after that doesn't parse anything, but changes the parser
	//   environment when run immediately after a frontmatter hit
	// - Add a core rule before everything that resets any environment changes when running
	//   on a new markdown document
	let osuLayout: string | undefined;

	md.use(frontMatterPlugin, (rawMeta: string) => {
		const layoutMatch = rawMeta.match(/^layout: (main_page|markdown_page|post)$/m);

		if (layoutMatch != null) {
			osuLayout = layoutMatch[1];
		}
	});

	md.block.ruler.after('front_matter', 'osu_env_set', (state) => {
		if (state.tokens.length === 1 && state.tokens[0].type === 'front_matter' && osuLayout) {
			state.env.osuLayout = osuLayout;

			if (osuLayout === 'main_page') {
				state.md.set({ html: true });
			}
		}

		return false;
	});

	md.core.ruler.before('block', 'osu_env_reset', (state) => {
		if (state.tokens.length === 0) {
			osuLayout = undefined;
			state.env.osuLayout = 'markdown_page';
			state.md.set({ html: false });
		}
	});

	// Add top-level classes
	const originalRender = md.renderer.render;

	md.renderer.render = (tokens, options, env) => {
		let modifier = 'wiki';

		if (env.osuLayout === 'post') {
			modifier = 'news';
		}

		// TODO split osu-md into another more general base class so that main page can
		// stop using it
		return (
			`<div class="osu-md osu-md--${modifier}">` +
			originalRender.apply(md.renderer, [tokens, options, env]) +
			'</div>'
		);
	};
};
export default osuModifierPlugin;
