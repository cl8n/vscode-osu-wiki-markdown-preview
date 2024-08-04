import type MarkdownIt from 'markdown-it';

export function tokenAttrRemove(token: MarkdownIt.Token, name: string): void {
	if (token.attrs == null) {
		return;
	}

	const attrs = token.attrs.filter(([attrName]) => attrName !== name);

	token.attrs = attrs.length > 0 ? attrs : null;
}
