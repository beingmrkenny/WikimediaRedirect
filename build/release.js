const extensionName = 'WikimediaMobileRedirect';

const { compileManifest } = require('./manifest');
// const exec = require('child_process').execSync;
const fs = require('fs-extra');
const child_process = require('child_process');

function releaseZip(suffix = '') {
	const zipFileName = `${extensionName}${suffix}.zip`;

	try {
		fs.emptyDirSync(`/tmp/${extensionName}`);
	} catch (err) {
		console.log(err);
	}

	try {
		fs.removeSync(`${process.env.HOME}/Desktop/${zipFileName}`);
	} catch (err) {
		console.log(err);
	}

	const includes = [
		'img',
		'LICENSE',
		'manifest.json',
		'popup.css',
		'popup.html',
		'popup.js',
		'script.js',
		'URLProcessor.js',
	];

	for (let entry of includes) {
		fs.copySync('./' + entry, `/tmp/${extensionName}/${entry}`);
	}

	console.log('Run these commands to check your zip for lice');
	console.log(`zip -d ~/Desktop/${zipFileName} __MACOSX/\*`);
	console.log(`unzip -vl ~/Desktop/${zipFileName}`);
	console.log(' ');

	child_process.execSync(
		`zip -r ${process.env.HOME}/Desktop/${zipFileName} *`,
		{ cwd: `/tmp/${extensionName}` }
	);
}

compileManifest('2');
releaseZip('-Firefox');

compileManifest('3');
releaseZip();
