import type MarkdownIt from 'markdown-it';

function getFlagCodepoint(code: string): string {
	const flagCodepoint = code
		.split('')
		.map((c) => (c.charCodeAt(0) + 127397).toString(16))
		.join('-');

	return flagCodepoint;
}

function getFlagUrl(flagCodepoint: string): string {
	// TODO: Use local flag
	return `https://osu.ppy.sh/assets/images/flags/${flagCodepoint}.svg`;
}

const inlineFlag: MarkdownIt.ParserInline.RuleInline = (state) => {
	const pos = state.pos;

	if (
		pos + 3 >= state.posMax ||
		state.src.charCodeAt(pos) !== 0x3a /* : */ ||
		state.src.charCodeAt(pos + 1) !== 0x3a /* : */ ||
		state.src.charCodeAt(pos + 2) !== 0x7b /* { */
	) {
		return false;
	}

	const match = state.src.slice(pos).match(/^::{\s+flag=([A-Z]{2})\s+}::/);

	if (!match) {
		return false;
	}

	const flagCodepoint = getFlagCodepoint(match[1]);

	// Add a token for the custom syntax
	const token = state.push('flag_open', 'span', 1);
	token.attrs = [
		['class', 'flag-country flag-country--wiki'],
		['style', `background-image: url('${getFlagUrl(flagCodepoint)}')`],
	];

	state.push('flag_close', 'span', -1);
	state.pos += match[0].length;

	return true;
};

export default function osuFlagPlugin(md: MarkdownIt): void {
	md.inline.ruler.after('text', 'flag', inlineFlag);
}
