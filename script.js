const HOSTS = 'wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikiversity|wikivoyage|wiktionary';
const DESKTOP_REGEX = new RegExp(`^(?:https?:)?\/\/([a-z]+)\.(${HOSTS})\.org`);
const MOBILE_REGEX = new RegExp(`^(?:https?:)?\/\/([a-z]+)\.m\.(:?${HOSTS})\.org`);

document.addEventListener('DOMContentLoaded', () => {
	let toggleLink = document.getElementById('mw-mf-display-toggle') || document.querySelector('.stopMobileRedirectToggle');
	if (toggleLink) {
		toggleLink.addEventListener('click', function () {
			if (DESKTOP_REGEX.test(this.href)) {
				chrome.storage.local.set( { enabled : false } );
			} else if (MOBILE_REGEX.test(this.href)) {
				chrome.storage.local.set( { enabled : true } );
			}
		});
	}
});

chrome.storage.onChanged.addListener( (changes) => {

	let url = window.location,
		desktopMatches = url.href.match(DESKTOP_REGEX);

	if (
		(!desktopMatches || (desktopMatches && desktopMatches[1] !== 'www'))
		&& !url.search.includes('action=edit')
		&& !url.hash.includes('#/editor/')
		&& changes
		&& changes.enabled
		&& changes.enabled.newValue !== changes.enabled.oldValue
	) {

		if (changes.enabled.newValue === false) {
			window.location.replace(url.href.replace(MOBILE_REGEX, "https://$1.$2.org"));
		} else if (changes.enabled.newValue === true) {
			window.location.replace(url.href.replace(DESKTOP_REGEX, "https://$1.m.$2.org"));
		}

	}
});

chrome.storage.local.get('enabled', results => {
	if (typeof results.enabled == 'undefined' || results.enabled == true) {
		handleRedirect();
		window.onhashchange = handleRedirect;
	}
});

function handleRedirect () {
	let url = window.location;

	chrome.storage.local.get('redirect-edit-page', results => {

		let redirectEditPage = (results['redirect-edit-page'] == false) ? false : true;
		let desktopMatches = url.href.match(DESKTOP_REGEX);

		if (desktopMatches && desktopMatches[1] !== 'www') {
			if (
				(redirectEditPage == true && !url.search.includes('action=edit'))
				|| redirectEditPage == false
			) {
				// turn: https://en.wikipedia.org/wiki/Neferefre
				// into: https://en.m.wikipedia.org/wiki/Neferefre
				window.location.replace(url.href.replace(DESKTOP_REGEX, "https://$1.m.$2.org"));
			}
		}

		if (MOBILE_REGEX.test(url.href)) {
			if (redirectEditPage == true && url.hash.includes('#/editor/')) {
				// turn: https://en.m.wikipedia.org/wiki/Neferefre#/editor/0
				// or:   https://en.m.wikipedia.org/w/index.php?title=Neferefre#/editor/all
				// into: https://en.wikipedia.org/w/index.php?title=Neferefre&action=edit
				let title = (url.pathname == '/w/index.php')
					? url.search.replace(/.*title=([^&]+).*/, "$1")
					: url.pathname.replace(/\/w(iki)\//, '');

				window.location.replace(
					url.protocol + '//' +
					url.hostname.replace(MOBILE_REGEX, "$1.$2.org") +
					'/w/index.php?' +
					'title=' + title +
					'&action=edit'
				);
			}
		}

	});

}
