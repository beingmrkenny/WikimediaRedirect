handleRedirect();
window.onhashchange = handleRedirect;

function handleRedirect () {
	var url = window.location;

	if (/https?:\/\/[a-z][a-z]\.(:?wikipedia|wiktionary)\.org/.test(url.href)) {
		if (!url.search.includes('action=edit')) {
			// turn: https://en.wikipedia.org/wiki/Neferefre
			// into: https://en.m.wikipedia.org/wiki/Neferefre
			var newUrl = url.href.replace(/(https?:\/\/)([a-z][a-z])\.(wikipedia|wiktionary)\.org/, "$1$2.m.$3.org");
			window.location.replace(newUrl);
		}
	}

	if (/https?:\/\/[a-z][a-z]\.m\.(:?wikipedia|wiktionary)\.org/.test(url.href)) {
		if (url.hash.includes('#/editor/')) {
			// turn: https://en.m.wikipedia.org/wiki/Neferefre#/editor/0
			// and:  https://en.m.wikipedia.org/w/index.php?title=Neferefre#/editor/all
			// into: https://en.wikipedia.org/w/index.php?title=Neferefre&action=edit
			let title = (url.pathname == '/w/index.php')
				? url.search.replace(/.*title=([^&]+).*/, "$1")
				: url.pathname.replace(/\/w(iki)\//, '');
			let newUrl =
				url.protocol + '//' +
				url.hostname.replace(/([a-z][a-z])\.m\.(wikipedia|wiktionary)\.org/, "$1.$2.org") +
				'/w/index.php?' +
				'title=' + title +
				'&action=edit';
			window.location.replace(newUrl);
		}
	}
}
