// NOTE: This is for reference, it's not used

const NORMAL_DOMAINS = [
	'wikibooks',
	'wikiquote',
	'wiktionary',
	'wikipedia',
	'wikisource',
	'wikinews',
	'wikiversity',
	'wikivoyage'
];

const IRREGULAR_DOMAINS = {
	wikidata : {
		mobile: "m.wikidata.org",
		desktop: "www.wikidata.org"
	},
	wikimedia : {
		normalDomains : [
			"species.wikimedia.org",
			"commons.wikimedia.org",
			"meta.wikimedia.org",
			"incubator.wikimedia.org"
		],
		doNotRedirect : [
			"wikitech.wikimedia.org"
		]
	},

}
