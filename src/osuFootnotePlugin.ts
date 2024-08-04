import type MarkdownIt from 'markdown-it';

function getFootnoteId(tokens: MarkdownIt.Token[], idx: number): number {
	return Number(tokens[idx].meta.id + 1);
}

function getFootnoteRefId(tokens: MarkdownIt.Token[], idx: number, id: number): string {
	return `fnref-${id}__${tokens[idx].meta.subId}`;
}

const render_footnote_ref: MarkdownIt.Renderer.RenderRule = (tokens, idx) => {
	const id = getFootnoteId(tokens, idx);
	const refid = getFootnoteRefId(tokens, idx, id);

	return (
		`<sup id="${refid}">` +
		`<a href="#fn-${id}" class="osu-md__link osu-md__link--footnote-ref">` +
		id +
		'</a>' +
		'</sup>'
	);
};

const render_footnote_block_open: MarkdownIt.Renderer.RenderRule = () => {
	return '<section class="osu-md__footnote-container"><ol>';
};

const render_footnote_open: MarkdownIt.Renderer.RenderRule = (tokens, idx) => {
	const id = getFootnoteId(tokens, idx);

	return `<li id="fn-${id}" class="osu-md__list-item osu-md__list-item--footnote">`;
};

const render_footnote_anchor: MarkdownIt.Renderer.RenderRule = (tokens, idx) => {
	const id = getFootnoteId(tokens, idx);
	const refid = getFootnoteRefId(tokens, idx, id);

	return `&nbsp;<a href="#${refid}">↑</a>`;
};

const osuFootnotePlugin: MarkdownIt.PluginSimple = (md) => {
	md.renderer.rules.footnote_ref = render_footnote_ref;
	md.renderer.rules.footnote_block_open = render_footnote_block_open;
	md.renderer.rules.footnote_open = render_footnote_open;
	md.renderer.rules.footnote_anchor = render_footnote_anchor;
};
export default osuFootnotePlugin;
