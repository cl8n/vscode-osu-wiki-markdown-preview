# osu! wiki markdown preview

This extension simulates the osu! website in the markdown preview window. You should enable this extension in your osu-wiki workspace, but disable it globally.

## Missing features

- International fonts
- News cover and author
- Custom element IDs
- Correct automatic header IDs

## Known issues

- VSCode's "code line" style can block inputs to floating content, like infoboxes
- VSCode's "code line" style causes ordered lists to lose their counter and shift left on hover

## Building the extension

Use `vsce` to package or publish this extension. The fonts "Inter" and "Torus" are not included in this repository but should be added under `share/inter` and `share/torus` before building.

## License

New code written by contributors to this project is licensed under MIT-0 ([LICENSE.txt](LICENSE.txt)). Significant portions of this extension are either directly copied from or re-implementing code from [osu-web](https://github.com/ppy/osu-web), which are licensed under the same AGPL license as osu-web ([LICENSE-osu-web.txt](LICENSE-osu-web.txt)).
