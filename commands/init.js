#!/usr/bin/env --harmony
const program = require('commander');
const chalk = require('chalk');
const {resolveFlavorName, resolveBuildType, resolvePlatform} = require('./tasks/config');
const {configureJavascriptFlavors, linkNativeFlavors} = require('./tasks/flavors');
const {configureCodePush} = require('./tasks/codePush');

//TODO accept flavor path from command line
function setup() {
    program
        .command('init')
        .description('init flavor')
        .alias('i')
        .arguments('<platform> [flavorName] [buildType]')
        .action((platform, flavorName, buildType) => run(platform, flavorName, buildType));
}

function run(argPlatform, argFlavorName, argBuildType) {
    console.log("init: run: " + argFlavorName);

    return Promise.all([
        resolveFlavorName(argFlavorName),
        resolveBuildType(argBuildType),
        resolvePlatform(argPlatform)
    ])
        .then(configureCodePush)
        .then(configureJavascriptFlavors)
        .then(linkNativeFlavors)
        .catch((error) => {
            console.error(chalk.red(error));
            process.exit(1);
        })
}

module.exports = {
    setup: setup,
    run: run
};


