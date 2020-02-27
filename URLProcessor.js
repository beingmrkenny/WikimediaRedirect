const HOSTS = 'wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikiversity|wikivoyage|wiktionary';
const URL_REGEX = new RegExp(`^https?:\/\/([a-z]+)?\.(m\.)?(:?${HOSTS})\.org`);

class URLProcessor {

	constructor (location) {
		this.url = location;
		this.doRedirect = true;
		this.isDesktopURL = null;
		this.isMobileURL = null;
		let hostMatches = this.url.href.match(URL_REGEX);
		this.domain = hostMatches[3];
		this.mobileSubdomain = hostMatches[2];
		this.subdomain = hostMatches[1];
	}

	canRedirect () {
		let canRedirect = true;
		if (this.subdomain == 'wikitech' || this.subdomain == 'www') {
			canRedirect = false;
		}
		if (this.domain == 'wikidata') {
			canRedirect = true;
		}
		return canRedirect;
	}

	isDesktop () {
		return (this.domain == 'wikidata')
			? (this.subdomain == 'www')
			: (typeof this.mobileSubdomain == 'undefined');
	}

	isMobile () {
		return (this.domain == 'wikidata')
			? (this.subdomain == 'm')
			: (this.mobileSubdomain == 'm.');
	}

	getDesktop () {
		let desktopURL = (this.domain == 'wikidata')
			? `https://www.${this.domain}.org`
			: `https://${this.subdomain}.${this.domain}.org`;
		return this.url.href.replace(URL_REGEX, desktopURL);
	}

	getMobile () {
		let mobileURL = (this.domain == 'wikidata')
			? `https://m.${this.domain}.org`
			: `https://${this.subdomain}.m.${this.domain}.org`;
		return this.url.href.replace(URL_REGEX, mobileURL);
	}

	isEditing () {
		return (this.isDesktop && this.url.search.includes('action=edit'))
		|| (this.isMobile && this.url.hash.includes('#/editor/'))
	}

	getDesktopEditingFromMobile () {
		const HOSTNAME_REGEX = new RegExp(`^([a-z]+)?\.(?:(m)\.)?(${HOSTS})\.org`);
		let title = (this.url.pathname == '/w/index.php')
			? this.url.search.replace(/.*title=([^&]+).*/, "$1")
			: this.url.pathname.replace(/\/w(iki)\//, '');
		return 'https://' +
			this.url.hostname.replace(HOSTNAME_REGEX, "$1.$3.org") +
			'/w/index.php?' +
			'title=' + title +
			'&action=edit';
	}

}
