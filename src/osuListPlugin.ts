import type MarkdownIt from 'markdown-it';

const osuListPlugin: MarkdownIt.PluginSimple = (md) => {
	// TODO breaks vscode code line

	md.renderer.rules.bullet_list_open = () => '<ul class="osu-md__list">';
	md.renderer.rules.ordered_list_open = () => '<ol class="osu-md__list osu-md__list--ordered">';
	md.renderer.rules.list_item_open = () => '<li class="osu-md__list-item"><div>';
	md.renderer.rules.list_item_close = () => '</div></li>';
};
export default osuListPlugin;
