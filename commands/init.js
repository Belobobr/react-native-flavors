#!/usr/bin/env --harmony
const program = require('commander');
const chalk = require('chalk');
const {resolveFlavorName, resolveBuildType, resolvePlatform} = require('./tasks/config');
const {configureJavascriptFlavors, linkNativeFlavors} = require('./tasks/flavors');
const {linkNativeBuildType} = require('./tasks/builtTypes');
const {configureCodePush} = require('./tasks/codePush');

//TODO accept flavor path from command line
function setup() {
    program
        .command('init')
        .description('init flavor')
        .alias('i')
        .arguments('<task>')
        .action((task) => run(task));
}

function run(task) {
    console.log("init: " + task);
    [argPlatform, argFlavorName, argBuildType] = task.split("-");
    console.log(argPlatform, argFlavorName, argBuildType);
    let platform;
    let flavorName;
    let buildType;

    return Promise.all([
        resolveFlavorName(argFlavorName),
        resolveBuildType(argBuildType),
        resolvePlatform(argPlatform)
    ])
        .then(([resolvedFlavorName, resolvedBuildType, resolvedPlatform]) => {
            platform = resolvedPlatform;
            flavorName = resolvedFlavorName;
            buildType = resolvedBuildType;
        })
        .then(() => configureCodePush(platform, flavorName, buildType))
        .then(() => configureJavascriptFlavors(flavorName))
        .then(() => linkNativeFlavors(flavorName))
        .then(() => linkNativeBuildType(buildType))
        .then(() => [platform, flavorName, buildType])
        .catch(error => {
            console.error(chalk.red(error));
            process.exit(1);
        })
}

module.exports = {
    setup: setup,
    run: run
};


