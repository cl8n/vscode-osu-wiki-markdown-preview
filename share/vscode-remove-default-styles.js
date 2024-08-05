document.querySelector('style#_defaultStyles')?.remove();
document.querySelectorAll('link[rel="stylesheet"][href*="/github/"]')
	.forEach((node) => node.remove());
document.querySelectorAll('link[rel="stylesheet"][href*="/markdown-language-features/"]')
	.forEach((node) => node.remove());
document.querySelectorAll('link[rel="stylesheet"][href*="/markdown-math/"]')
	.forEach((node) => node.remove());
