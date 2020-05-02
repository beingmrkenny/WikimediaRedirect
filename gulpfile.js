const EXTENSION_NAME = 'WikimediaRedirect';

const { src, dest, series, parallel, watch } = require('gulp');
// const rename = require('gulp-rename');

function releaseZip () {

	const glob = require('glob');
	const fs = require('fs-extra');
	const zip = require('gulp-zip');

	fs.emptyDirSync(`/tmp/${EXTENSION_NAME}`);
	try { fs.removeSync(`${process.env.HOME}/Desktop/${EXTENSION_NAME}.zip`) } catch (err) { console.log(err); }

	let includes = [
		'img',
		'LICENSE',
		'manifest.json',
		'popup.css',
		'popup.html',
		'popup.js',
		'script.js',
		'URLProcessor.js'
	];

	for (let entry of includes) {
		fs.copySync('./'+entry, `/tmp/${EXTENSION_NAME}/`+entry);
	}

	console.log('Run these commands to check your zip for lice');
	console.log(`zip -d ~/Desktop/${EXTENSION_NAME}.zip __MACOSX/\*`);
	console.log(`unzip -vl ~/Desktop/${EXTENSION_NAME}.zip`);

	return src(`/tmp/${EXTENSION_NAME}/**/*`)
		.pipe(zip(`${EXTENSION_NAME}.zip`))
		.pipe(dest(process.env.HOME+'/Desktop'));
}

exports.release = releaseZip;
