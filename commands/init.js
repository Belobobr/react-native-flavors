#!/usr/bin/env --harmony
const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = require("fs");
const ProjectConfig = require('./../react-native-cli/core');
Promise.promisifyAll(fs);
const linkAndroidFlavor = require('./../android/index');

//TODO accept flavor path from command line
function setup() {
    program
        .command('init')
        .description('init flavor')
        .alias('i')
        .arguments('[flavorName]')
        .action(flavorName => run(flavorName));
}

function resolveFlavorName(argFlavorName) {
    const CONFIG_PATH = './flavors/config.json';

    return fs.readFileAsync(CONFIG_PATH, 'utf8')
        .catch(() => {
            throw Error("Can't find flavor config at path: " + path.resolve(CONFIG_PATH))
        })
        .then(data => JSON.parse(data))
        .then(config => {
            let flavorName = argFlavorName || config.current;
            if (!flavorName) {
                throw Error('Flavor name not specified.');
            }

            if (!config.flavors) {
                throw Error('Flavors not specified in config.json.')
            }

            //ищем в конфиге указанный flavor, не нашли кидаем ошибку
            if (!config.flavors.includes(flavorName)) {
                throw Error('Flavor {' + flavorName + '} not specified in flavors.')
            }

            console.log('Resolved flavorName: ' + flavorName);
            return flavorName;
        })
}

function linkNativeFlavors(flavorName) {
    console.log('Config: ' + ProjectConfig);
    let config = ProjectConfig.get();
    console.log('Link native flavors');
    return linkAndroidFlavor(config.android, flavorName);
}

function configureJavascriptFlavors(flavorName) {
    const CURRENT = './flavors/current';

    return Promise.resolve(flavorName)
        .then(flavorName => {
            return './flavors/' + flavorName + '/';
        })
        .then(flavorPath => {
            return fs.openAsync(flavorPath, 'r')
                .then(() => Promise.resolve(flavorPath))
                .catch(() => {
                    throw Error("Can't find flavor at path: " + path.resolve(flavorPath))
                })
        })
        .then(flavorPath => {
            return fs.unlinkAsync(CURRENT)
                .then(() => Promise.resolve(flavorPath))
                .catch(() => {
                    throw Error("Can't remove previously created symlink at path: " + path.resolve(flavorPath))
                })
        })
        .then((flavorPath) => {
            console.log('Flavor creating symlink.');
            return fs.symlinkAsync(path.resolve(flavorPath), path.resolve('./flavors/current'))
                .then(() => {
                    console.log('Flavor initialization completed.');
                    return Promise.resolve(flavorName);
                })
                .catch((error) => {
                    return Promise.reject(error);
                })
        })
}

function run(argFlavorName) {
    console.log("init: run: " + argFlavorName);

    return resolveFlavorName(argFlavorName)
        .then(configureJavascriptFlavors)
        .then(linkNativeFlavors)
        .catch((error) => {
            console.error(chalk.red(error));
            process.exit(1);
        })

}

function log(file, cb) {
    console.log(file.path);
    cb(null, file);
}

module.exports = {
    setup: setup,
    run: run
};


