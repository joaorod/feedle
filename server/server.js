#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const planify = require('planify');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const webpackDevCliConfig = require('../.startup/webpack-devcli.config');
const bodyParser = require("body-parser");

// ---------------------------------------------------------
// CLI definition
// ---------------------------------------------------------

const argv = yargs
.strict()
.wrap(Math.min(120, yargs.terminalWidth()))
.help('help').alias('help', 'h')
.usage('Usage: ./$0 [options]')
.demand(0, 0)
.option('env', {
    alias: 'e',
    type: 'string',
    default: 'dev',
    describe: 'The environment',
})
.option('hostname', {
    alias: 'H',
    type: 'string',
    default: 'localhost',
})
.option('port', {
    alias: 'p',
    type: 'number',
    default: 3000,
})
.option('mock', {
    alias: ['m'],
    type: 'string',
    default: 'false',
    describe: 'Mock ajax requests',
})
.option('reporter', {
    alias: ['r', 'R'],
    type: 'string',
    describe: 'Any of the planify\'s reporters',
})
.example('$0', 'Serves the application for the dev environment')
.example('$0 --env prod', 'Serves the application for the prod environment')
.example('$0 --env staging --port 8081 --hostname 0.0.0.0', 'Serves the application for the staging \
environment on all network interfaces in port 8081')
.argv;

// ---------------------------------------------------------
// Functions
// ---------------------------------------------------------

function setupClientCompiler(app) {
    const clientConfig = webpackDevCliConfig(argv);
    const clientCompiler = webpack(clientConfig);

    const webpackDevMiddlewareInstance = webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        watchOptions: {
            aggregateTimeout: 300,  // Wait so long for more changes
            poll: true,             // Use polling because fs events is not consistent across OS's
        },
        noInfo: true,
        quiet: true,
        lazy: false,
    });

    webpackDevMiddlewareInstance.waitUntilValid((stats) => {
        const statsJson = stats.toJson();
        const statsStr = stats.toString({ chunks: false, children: false, modules: false, colors: true }).trim();

        if (statsJson.errors.length) {
            process.stdout.write('> Webpack dev build failed..\n');
            process.stdout.write('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            process.stdout.write(`${statsStr}\n\n`);
            return;
        }

        process.stdout.write('Webpack dev build successful\n');
        process.stdout.write('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.stdout.write(`${statsStr}\n\n`);
    });

    app.use(webpackDevMiddlewareInstance);
    app.use(webpackHotMiddleware(clientCompiler, { log: null }));
}

function runServer() {
    const app = express();

    // When developing, we want the client-side to be compiled on every change with hmre
    argv.env === 'dev' && setupClientCompiler(app);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // Public files are served as usually
    app.use('/', express.static('./'));

    var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || argv.port || 8080;
    var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || argv.hostname;
    
    // Start server
    return new Promise((resolve, reject) => {
        process.stdout.write(`Environment:            ${argv.env}\n`);
        process.stdout.write(`Server address:         http://${server_ip_address}:${server_port}\n`);

        if (argv.env === 'dev') {
            process.stdout.write('Hot module replacement: on\n');
        }
        
        // routes ======================================================================
        var webApi = require('./bin/webapi.js');
        webApi.WebAPI.register(app);
        
        
        app.listen(process.env.PORT || 8080, server_ip_address, (err) => {
            if (err) {
                reject(err);
            } else {
                var port = app.address().port;
                console.log("App now running on port", port);
                process.stdout.write('\nServer is now up and running, press CTRL-C to stop.\n');
                argv.env === 'dev' && process.stdout.write('Triggering first build, hang on...\n\n');
            }
        });
    });
}

// ---------------------------------------------------------
// Steps
// ---------------------------------------------------------

planify({ exit: true, reporter: argv.reporter })
.step('Running server', () => runServer())

.run();
