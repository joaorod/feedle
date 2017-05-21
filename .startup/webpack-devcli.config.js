// Utilities
const Path = require('path');
const ProjectDir = Path.resolve(`${__dirname}/..`);

// Webpack plugins
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const SvgStorePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');

// Config
const PackageJson = require('../package.json');


function buildConfig(options) {
    // check env option
    const isDev = options.env === 'dev';

    if (!isDev) { return {}; }

    return {

        // ---------------------------------------------------------
        // Webpack configuration
        // ---------------------------------------------------------

        entry: {
            index: [`${ProjectDir}/index.tsx`, isDev && 'webpack-hot-middleware/client'].filter((val) => val),
        },

        output: {
            path: isDev ? Path.join(__dirname, '../build') : Path.join(__dirname, '../build'),
            filename: isDev ? '[name].js' : '[name].js',
            publicPath: isDev ? `/build` : `/build`,
            libraryTarget: 'var',
            library: PackageJson.name,
        },

        devtool: isDev ? 'source-map' : false,

        resolve: {
            extensions: ['', '.js', '.jsx', '.css', '.ts', '.tsx', '.svg'],
            modulesDirectories: ['node_modules'],
        },

        plugins: [

            isDev && new Webpack.HotModuleReplacementPlugin(),

            new Webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `"${isDev ? 'development' : 'production'}"`,
                },
                __CLIENT__: true,
                __SERVER__: false,
                __MOCKS__: true,
            }),

            !isDev && new Webpack.optimize.UglifyJsPlugin({
                minimize: true,
                mangle: true,
                compress: {
                    warnings: false,
                    drop_console: true,   // Drop console.* statements
                    drop_debugger: true,  // Drop debugger statements
                    screw_ie8: true,
                },
            }),

            !isDev && new ExtractTextPlugin('[name].css'),
            isDev && new ExtractTextPlugin('[name].css'),

            new Webpack.optimize.OccurrenceOrderPlugin(),

            new Webpack.optimize.DedupePlugin(),

            new WebpackAssetsManifest({
                output: 'manifest-client.json',
            }),

            new SvgStorePlugin(),

        ].filter((val) => val),

        // PostCss plugins config
        postcss() {
            return [
                ((!this.resourcePath.indexOf('node_modules') && !this.resourcePath.endsWith('flags.css')) && require('postcss-ltr-rtl-detect')({
                    importantDetect: true,
                    unitsPxDetect: true,
                    unitsMsg: 'Consider use "rem" or "em" unit',
                })),
                require('postcss-reporter'), /* needed to show postcss-ltr-rtl-detect warnings */
                require('postcss-import'),
                require('postcss-mixins')({
                    
                }),
                require('postcss-cssnext')({
                    features: {
                        customProperties: {  },
                        customMedia: {  },
                        calc: { preserve: true },
                    },
                }),
                require('postcss-nested'),
            ].filter((val) => val);
        },

        module: {
            loaders: [{
                test: /\.css$/,
                loader: !isDev ? ExtractTextPlugin.extract(`css-loader?camelCase&modules&importLoaders=1&localIdentName=${PackageJson.cssPrefix}[hash:6]!postcss-loader`) :
                    'style!css-loader?camelCase&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:6]!postcss-loader',
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loaders: [isDev && 'react-hot', 'babel-loader', 'ts-loader'].filter((val) => val),
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [isDev && 'react-hot', 'babel-loader'].filter((val) => val),
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            }],
        },
    };
}
module.exports = buildConfig;
