# osu! wiki markdown preview

This extension simulates the osu! website in the markdown preview window. You should enable this extension in your osu-wiki workspace, but disable it globally.

Assets used in this project are modified versions of those in the [osu-web repository](https://github.com/ppy/osu-web). The fonts "Inter" and "Torus" are not included in this repository but should be added under `share/inter` and `share/torus` respectively to build the extension.

## Missing features

- osu! style tooltips
- Custom element IDs
- International fonts
- News styling
- osu! style footnotes
- Automatic header IDs matching osu!
- Some remaining osu-md styling
- Likely more that I'm unaware of

## Known issues

- VSCode's "code line" style can block inputs to floating content, like infoboxes
