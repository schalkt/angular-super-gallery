const path = require('path');
const fs = require('fs');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packagejson = JSON.parse(fs.readFileSync('./package.json'));
const PROD = process.env.NODE_ENV === 'production';

// --- Version replace in asg-service.ts ---
const asgServicePath = path.resolve(__dirname, 'src/asg-service.ts');
let asgServiceContent = fs.readFileSync(asgServicePath, 'utf8');
asgServiceContent = asgServiceContent.replace(/version.*"\d+\.\d+\.\d+"/, `version = "${packagejson.version}"`);
fs.writeFileSync(asgServicePath, asgServiceContent);

// --- Angular template cache (simple implementation) ---
const glob = require('glob');
const templateCachePath = path.resolve(__dirname, 'src/asg-templates.js');
const templateFiles = glob.sync('./src/views/**/*.html');
let templateCacheContent = `angular.module('angularSuperGallery').run(['$templateCache', function($templateCache) {\n`;
templateFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
        .replace(/\\/g, '\\\\')      // escape backslash
        .replace(/'/g, "\\'")        // escape single quote
        .replace(/\r?\n/g, '\\n');   // escape newlines
    // Change: key should be relative to src/ and not start with a slash
    let key = file.replace(/^src/, ''); // removes './src/' from start
    key = key.replace(/\\/g, '/'); // normalize slashes
    templateCacheContent += `  $templateCache.put('${key}', '${content}');\n`;
	console.log(`Added template: ${key}`); // Log added templates
});
templateCacheContent += '}]);\n';
templateCacheContent = templateCacheContent.replace(/button\\/g, 'button/').replace(/\\views\\/g, '/views/');
fs.writeFileSync(templateCachePath, templateCacheContent);

module.exports = {
    mode: PROD ? 'production' : 'development',
    entry: {
        'angular-super-gallery.min': './src/asg.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'angular-super-gallery.min.css'
        }),
        ...(PROD ? [new CompressionPlugin({
            algorithm: "gzip",
            test: /\.(js|ts|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })] : [])
    ]
};
