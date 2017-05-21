'use strict';

const yargs = require('yargs');
const planify = require('planify');
const rimraf = require('rimraf');
const webpack = require('webpack');

const webpackClientConfig = require('./webpack-devcli.config');
const webpackDevCliConfig = require('./webpack-devcli.config');

const projectDir = `${__dirname}/..`;
// ---------------------------------------------------------
// CLI definition
// ---------------------------------------------------------

const argv = yargs
.strict()
.wrap(Math.min(120, yargs.terminalWidth()))
.version().alias('version', 'v')
.usage('Usage: ./$0 [options]')
.demand(0, 0)
.option('env', {
    alias: 'e',
    type: 'string',
    default: 'prod',
    describe: 'The environment',
})
.option('minify', {
    alias: 'm',
    type: 'boolean',
    default: true,
    describe: 'Whether to minify or assets (including index.html)',
})
.option('reporter', {
    alias: ['r', 'R'],
    type: 'string',
    describe: 'Any of the planify\'s reporters',
})
.example('$0 --env staging', 'Builds the application for the staging environment')
.example('$0 --no-minify', 'Builds the application for the production environment but do not minify')
.argv;

if (argv.help) {
    yargs.showHelp('log');
    process.exit(0);
}

// ---------------------------------------------------------
// Functions
// ---------------------------------------------------------

function cleanBuild() {
    process.stdout.write('Cleaning previous build..\n');
    rimraf.sync(`${projectDir}/build`);
}


function buildDevCli(options) {
    const environment = options.env ? options.env : argv.env;

    return new Promise((resolve, reject) => {
        const clientConfig = webpackDevCliConfig({ env: environment });

        webpack(clientConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }

            const statsJson = stats.toJson();
            const statsStr = stats.toString({ chunks: false, children: false, modules: false, colors: true }).trim();

            if (statsJson.errors.length) {
                return reject(Object.assign(new Error('Webpack server-side build failed'), { detail: statsStr }));
            }

            process.stdout.write(`${statsStr}\n\n`);

            resolve();
        });
    });
}

planify({ exit: true, reporter: argv.reporter })

.step('Removing previous build', () => cleanBuild())

.step('Building devcli with webpack', { slow: 15000 }, () => buildDevCli({ env: 'dev' }))

.run();
