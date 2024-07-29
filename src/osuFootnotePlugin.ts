import type MarkdownIt from 'markdown-it';

export default function osuFootnotePlugin(md: MarkdownIt): void {
	// Copied from markdown-it-footnote
	md.renderer.rules.footnote_block_open = () => (
		'<section class="footnotes">\n' +
		'<ol class="footnotes-list">\n'
	);
}
