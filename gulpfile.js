const { src, dest, series, parallel, watch } = require('gulp');
// const rename = require('gulp-rename');

function releaseZip () {

	const glob = require('glob');
	const fs = require('fs-extra');
	const zip = require('gulp-zip');

	fs.emptyDirSync('/tmp/WikimediaRedirect');
	try { fs.removeSync(process.env.HOME+'/Desktop/WikimediaRedirect.zip') } catch (err) { console.log(err); }

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
		fs.copySync('./'+entry, '/tmp/WikimediaRedirect/'+entry);
	}

	console.log('Run these commands to check your zip for lice');
	console.log('zip -d ~/Desktop/WikimediaRedirect.zip __MACOSX/\*');
	console.log('unzip -vl ~/Desktop/WikimediaRedirect.zip');

	return src('/tmp/WikimediaRedirect/**/*')
		.pipe(zip('WikimediaRedirect.zip'))
		.pipe(dest(process.env.HOME+'/Desktop'));
}

exports.release = releaseZip;
