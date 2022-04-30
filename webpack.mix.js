const mix = require('laravel-mix');
const CompressionPlugin = require('compression-webpack-plugin');
const PROD = (process.env.NODE_ENV && process.env.NODE_ENV === 'production');
const fs = require('fs');
const package = JSON.parse(fs.readFileSync('./package.json'));

require('laravel-mix-angular-templatecache');

mix.disableNotifications();

mix.extend('replace', function (webpackConfig, ...args) {

	let content = fs.readFileSync(args[0]).toString();

	args[1].forEach(function (item) {
		content = content.replace(item[0], item[1]);
	});

	fs.writeFileSync(args[0], content);

	return webpackConfig;

});

mix.webpackConfig({
	plugins: [
		PROD ? new CompressionPlugin({
			//asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.ts$|\.css$|\.html$|\.svg$/,
			threshold: 10240,
			minRatio: 0.8

		}) : () => { }
	],
});


mix.before(() => {

	// angular template cache
	mix.cacheTemplates('./src/views/**/*.html', {
		root: '/views',
		module: 'angularSuperGallery',
		outputFilename: './src/asg-templates.js',
	}).replace('./src/asg-templates.js', [
		[/button\\/g, 'button/'],
		[/\\views\\/g, '/views/'],
	]);

});


// compile typesript and scss
mix.ts('./src/asg.ts', './dist/angular-super-gallery.min.js')
	.sass('./src/asg.scss', './dist/angular-super-gallery.min.css');


// update version
mix.replace('./src/asg-service.ts', [
	[/version.*"\d+\.\d+\.\d+"/, 'version = "' + package.version + '"']
]);

