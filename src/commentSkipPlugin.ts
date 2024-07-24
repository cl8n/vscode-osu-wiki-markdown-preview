import type MarkdownIt from 'markdown-it';

// Mostly copied from markdown-it
const htmlBlockComment: MarkdownIt.ParserBlock.RuleBlock = (state, startLine, endLine, silent) => {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];

	if (
		state.sCount[startLine] - state.blkIndent >= 4 ||
		state.src.charCodeAt(pos) !== 0x3C/* < */
	) {
		return false;
	}

	let lineText = state.src.slice(pos, max);

	if (!lineText.startsWith('<!--')) {
		return false;
	}

	if (silent) {
		return true;
	}

	let nextLine = startLine + 1;

	if (!lineText.includes('-->')) {
		for (; nextLine < endLine; nextLine++) {
			if (state.sCount[nextLine] < state.blkIndent) {
				break;
			}

			pos = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			lineText = state.src.slice(pos, max);

			if (lineText.includes('-->')) {
				if (lineText.length !== 0) {
					nextLine++;
				}

				break;
			}
		}
	}

	state.line = nextLine;

	return true;
};

// Mostly copied from markdown-it
const htmlInlineComment: MarkdownIt.ParserInline.RuleInline = (state) => {
	const max = state.posMax;
	const pos = state.pos;

	if (
		pos + 2 >= max ||
		state.src.charCodeAt(pos) !== 0x3C/* < */ ||
		state.src.charCodeAt(pos + 1) !== 0x21/* ! */
	) {
		return false;
	}

	const match = state.src.slice(pos).match(/^(?:<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->)/);

	if (!match) {
		return false;
	}

	state.pos += match[0].length;

	return true;
};

export default function commentSkipPlugin(md: MarkdownIt): void {
	md.block.ruler.after('html_block', 'html_block_comment', htmlBlockComment);
	md.inline.ruler.after('html_inline', 'html_inline_comment', htmlInlineComment);
}
