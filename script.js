chrome.storage.local.get('enabled', results => {
	if (typeof results.enabled == 'undefined' || results.enabled == true) {
		handleRedirect();
		window.onhashchange = handleRedirect;
	}
});

function handleRedirect () {
	let url = window.location;

	let wikimediaHosts = 'wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikiversity|wikivoyage|wiktionary';

	let desktopURLRegex = new RegExp(`^https?:\/\/([a-z]+)\.(${wikimediaHosts})\.org`),
		mobileURLRegex = new RegExp(`^https?:\/\/([a-z]+)\.m\.(:?${wikimediaHosts})\.org`);

	chrome.storage.local.get('redirect-edit-page', results => {

		let redirectEditPage = (results['redirect-edit-page'] == false) ? false : true;
		let desktopMatches = url.href.match(desktopURLRegex);

		if (desktopMatches && desktopMatches[1] !== 'www') {
			if (
				(redirectEditPage == true && !url.search.includes('action=edit'))
				|| redirectEditPage == false
			) {
				// turn: https://en.wikipedia.org/wiki/Neferefre
				// into: https://en.m.wikipedia.org/wiki/Neferefre
				var newURL = url.href.replace(desktopURLRegex, "https://$1.m.$2.org");
				window.location.replace(newURL);
			}
		}

		if (mobileURLRegex.test(url.href)) {
			if (redirectEditPage == true && url.hash.includes('#/editor/')) {
				// turn: https://en.m.wikipedia.org/wiki/Neferefre#/editor/0
				// or:   https://en.m.wikipedia.org/w/index.php?title=Neferefre#/editor/all
				// into: https://en.wikipedia.org/w/index.php?title=Neferefre&action=edit
				let title = (url.pathname == '/w/index.php')
					? url.search.replace(/.*title=([^&]+).*/, "$1")
					: url.pathname.replace(/\/w(iki)\//, '');

				window.location.replace(
					url.protocol + '//' +
					url.hostname.replace(mobileURLRegex, "$1.$2.org") +
					'/w/index.php?' +
					'title=' + title +
					'&action=edit'
				);
			}
		}

	});

}
