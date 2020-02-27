var url = new URLProcessor (window.location);

document.addEventListener('DOMContentLoaded', () => {
	let toggleLink = document.getElementById('mw-mf-display-toggle') || document.querySelector('.stopMobileRedirectToggle');
	if (toggleLink) {
		toggleLink.addEventListener('click', function () {
			var url = new URLProcessor (this);
			if (url.isDesktop()) {
				chrome.storage.local.set( { enabled : false } );
			} else if (url.isMobile()) {
				chrome.storage.local.set( { enabled : true } );
			}
		});
	}
});

chrome.storage.onChanged.addListener( (changes) => {
	let url = new URLProcessor(window.location);
	if (
		url.canRedirect()
		&& !url.isEditing()
		&& changes && changes.enabled
	) {
		let newURL = (changes.enabled.newValue) ? url.getMobile() : url.getDesktop();
		window.location.replace(newURL);
	}
});

chrome.storage.local.get('enabled', results => {
	if (typeof results.enabled == 'undefined' || results.enabled == true) {
		handleRedirectOnLoad();
		window.addEventListener('hashchange', handleRedirectOnLoad);
	}
});

function handleRedirectOnLoad () {
	let url = new URLProcessor(window.location);
	if (url.canRedirect()) {
		chrome.storage.local.get('redirect-edit-page', results => {
			let redirectEditPage = (results && results['redirect-edit-page'] == false) ? false : true;
			if (url.isDesktop() && !url.isEditing()) {
				window.location.replace(url.getMobile());
			}
			if (url.isMobile() && redirectEditPage && url.isEditing()) {
				window.location.replace(url.getDesktopEditingFromMobile());
			}
		});
	}
}
