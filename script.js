chrome.storage.local.get('enabled', results => {
	if (typeof results.enabled == 'undefined' || results.enabled == true) {
		handleRedirect();
		window.onhashchange = handleRedirect;
	}
});

function handleRedirect () {
	let url = window.location;

	let wikimediaHosts = 'wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikiversity|wikivoyage|wiktionary';

	let testDesktopURLRegex = new RegExp(`https?:\/\/[a-z]+\.(:?${wikimediaHosts})\.org`),
		matchDesktopURLRegex = new RegExp(`([a-z]+)\.(${wikimediaHosts})\.org`),
		testMobileURLRegex = new RegExp(`https?:\/\/[a-z]+\.m\.(:?${wikimediaHosts})\.org`),
		matchMobileURLRegex = new RegExp(`([a-z]+)\.m\.(${wikimediaHosts})\.org`);

	chrome.storage.local.get('redirect-edit-page', results => {

		let redirectEditPage = (results['redirect-edit-page'] == false) ? false : true;

		if (testDesktopURLRegex.test(url.href)) {
			if (
				(redirectEditPage == true && !url.search.includes('action=edit'))
				|| redirectEditPage == false
			) {
				// turn: https://en.wikipedia.org/wiki/Neferefre
				// into: https://en.m.wikipedia.org/wiki/Neferefre
				var newURL = url.href.replace(matchDesktopURLRegex, "$1.m.$2.org");
				window.location.replace(newURL);
			}
		}

		if (testMobileURLRegex.test(url.href)) {
			if (redirectEditPage == true && url.hash.includes('#/editor/')) {
				// turn: https://en.m.wikipedia.org/wiki/Neferefre#/editor/0
				// and:  https://en.m.wikipedia.org/w/index.php?title=Neferefre#/editor/all
				// into: https://en.wikipedia.org/w/index.php?title=Neferefre&action=edit
				let title = (url.pathname == '/w/index.php')
					? url.search.replace(/.*title=([^&]+).*/, "$1")
					: url.pathname.replace(/\/w(iki)\//, '');
				let newURL =
					url.protocol + '//' +
					url.hostname.replace(matchMobileURLRegex, "$1.$2.org") +
					'/w/index.php?' +
					'title=' + title +
					'&action=edit';
				window.location.replace(newURL);
			}
		}

	});

}
