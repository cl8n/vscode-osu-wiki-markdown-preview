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
	md.set({ html: env.osu.layout !== 'markdown_page' });
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

		const html = originalRender.apply(md.renderer, [tokens, options, env]);

		if (env.osu.layout === 'main_page') {
			return (
				'<div class="osu-layout osu-layout--body" style="--base-hue-default: 45;">' +
				'<div class="osu-page osu-page--wiki osu-page--wiki-main">' +
				'<div class="wiki-main-page">' +
				html +
				'</div>' +
				'</div>' +
				'</div>'
			);
		}

		if (env.osu.layout === 'markdown_page') {
			return (
				'<div class="osu-layout osu-layout--body" style="--base-hue-default: 45;">' +
				'<div class="osu-page osu-page--wiki">' +
				'<div class="wiki-page">' +
				'<div class="wiki-page__toc"></div>' +
				'<div class="wiki-page__content">' +
				renderWikiNotice(env) +
				`<div class="osu-md osu-md--wiki">` +
				html +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>'
			);
		}

		if (env.osu.layout === 'post') {
			return (
				'<div class="osu-layout osu-layout--body" style="--base-hue-default: 255;">' +
				'<div class="osu-page osu-page--wiki">' +
				'<div class="wiki-page">' +
				'<div class="wiki-page__toc"></div>' +
				'<div class="wiki-page__content">' +
				'<div class="news-show">' +
				// TODO: Support news cover
				// `<a class="news-card news-card--show" href="..."><div class="news-card__cover-container"><img class="news-card__cover" src="..."><div class="news-card__time js-tooltip-time" title="...">...</div></div></a>` +
				'<div class="news-show__info">' +
				`<h1 class="news-show__title">${env.osu.title ?? 'Untitled news post'}</h1>` +
				// TODO: Support news author
				// `<p class="news-show__author">by <strong>...</strong></p>` +
				'</div>' +
				`<div class="osu-md osu-md--news">` +
				html +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>'
			);
		}

		throw new Error('Invalid osu! layout type');
	};
};
export default osuModifierPlugin;

function renderWikiNotice(env: any): string {
	const translation = false; // TODO
	let html = '';

	if (translation && env.osu.legal) {
		html += (
			'<div class="wiki-notice wiki-notice--important">' +
			'This translation is provided for convenience only. The original <a href="./en.md">English version</a> shall be the sole legally binding version of this text.' +
			'</div>'
		);
	}

	if (translation && env.osu.outdated_translation) {
		html += (
			'<div class="wiki-notice">' +
			'This page contains an outdated translation of the original content. Please check the <a href="./en.md">English version</a> for the most accurate information (and consider updating the translation if you are able to help out)!' +
			'</div>'
		);
	}

	if (env.osu.outdated) {
		html += (
			'<div class="wiki-notice">' +
			'The content on this page is incomplete or outdated. If you are able to help out, please consider updating the article!' +
			'</div>'
		);
	} else if (env.osu.needs_cleanup) {
		html += (
			'<div class="wiki-notice">' +
			'This page does not meet the standards of the osu! wiki and needs to be cleaned up or rewritten. If you are able to help out, please consider updating the article!' +
			'</div>'
		);
	}

	if (env.osu.stub) {
		html += (
			'<div class="wiki-notice">' +
			'This article is incomplete and waiting on someone to expand it.' +
			'</div>'
		);
	}

	return html;
}
