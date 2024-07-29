import type MarkdownIt from 'markdown-it';

const osuListPlugin: MarkdownIt.PluginSimple = (md) => {
	md.renderer.rules.list_item_open = () => '<li><div>';
	md.renderer.rules.list_item_close = () => '</div></li>';
};
export default osuListPlugin;
