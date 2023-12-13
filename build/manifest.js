// npm run manifest 2/3

exports.compileManifest = (arguments) => {

	const args = typeof arguments == 'undefined' ? process.argv : arguments;

	if (!args.includes('2') && !args.includes('3')) {
		console.log('Need to specify which version you want: 2 or 3');
		return;
	}

	const manifestVersion = args.includes('2') ? 2 : 3;
	const fs = require('fs');
	const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

	manifest.manifest_version = parseInt(manifestVersion);

	const browserAction = manifest.browser_action || manifest.action;

	delete manifest.browser_action;
	delete manifest.action;

	if (manifestVersion == 2) {
		manifest.browser_action = browserAction;
	} else {
		manifest.action = browserAction;
	}

	try {
		fs.unlinkSync('manifest.json');
	} catch (e) {}

	fs.writeFileSync(
		'manifest.json',
		JSON.stringify(manifest, null, 2)
	);
};

exports.compileManifest();
