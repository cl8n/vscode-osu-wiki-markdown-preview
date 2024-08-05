import type MarkdownIt from 'markdown-it';
import frontMatterPlugin from 'markdown-it-front-matter';
import { parse as parseYaml } from 'yaml';

function getFrontMatterSettings(tokens: MarkdownIt.Token[]): Record<string, any> {
	const firstToken = tokens[0];

	if (firstToken?.type !== 'front_matter') {
		return {};
	}

	// If the front matter has been parsed before, return it
	if (
		typeof firstToken.meta === 'object' &&
		firstToken.meta != null &&
		'parsed' in firstToken.meta
	) {
		return firstToken.meta.parsed;
	}

	// Replace the token meta with a parsed version if it's still in raw form
	if (typeof firstToken.meta === 'string') {
		try {
			firstToken.meta = { parsed: parseYaml(firstToken.meta) };
		} catch {
			firstToken.meta = { parsed: {} };
		}

		return firstToken.meta.parsed;
	}

	return {};
}

function setEnvironment(md: MarkdownIt, env: any, settings: Record<string, any>): void {
	env.osu = settings;
	env.osu.layout ??= 'markdown_page';
	md.set({ html: env.osu.layout === 'main_page' });
}

const osuEnvReset: MarkdownIt.Core.RuleCore = (state) => {
	if (state.tokens.length === 0) {
		setEnvironment(state.md, state.env, {});
	}
};

const osuEnvSet: MarkdownIt.ParserBlock.RuleBlock = (state) => {
	if (state.tokens.length === 1) {
		setEnvironment(state.md, state.env, getFrontMatterSettings(state.tokens));
	}

	return false;
};

const osuModifierPlugin: MarkdownIt.PluginSimple = (md) => {
	// Reset the parser environment we may have changed based on the layout key when parsing a new
	// markdown document
	md.core.ruler.before('block', 'osu_env_reset', osuEnvReset);

	// Even though VSCode uses this plugin by default, it needs to be added here to be in the correct
	// position, and allow for the next plugin to reference its position
	//
	// Also, even though the plugin supports adding a callback here to handle the extracted front
	// matter, it has no access to the environment
	md.use(frontMatterPlugin, () => { });

	// Immediately after the front matter rule, and only on the first time it produces any tokens,
	// try to update the environment using the layout key
	md.block.ruler.after('front_matter', 'osu_env_set', osuEnvSet);

	// Add top-level classes
	const originalRender = md.renderer.render;

	md.renderer.render = (tokens, options, env) => {
		// VSCode does not persist the environment between parse and render, so it is re-created here
		setEnvironment(md, env, getFrontMatterSettings(tokens));

		let modifier = 'wiki';

		if (env.osu.layout === 'post') {
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
