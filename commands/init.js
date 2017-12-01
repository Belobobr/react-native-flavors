#!/usr/bin/env --harmony
const map = require('map-stream');
const vfs = require('vinyl-fs');
const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = require("fs");
Promise.promisifyAll(fs);

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
    console.log('Resolve flavor name for commandArguments: ' + argFlavorName);
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
                throw Error('Flavor {' + flavorName +  '} not specified in flavors.')
            }

            console.log('Resolved flavorName: ' + flavorName);
            return flavorName;
        })
}

function run(argFlavorName) {
    console.log("init: run: " + argFlavorName);
    let resolvedFlavorName;

    return resolveFlavorName(argFlavorName)
        .then(flavorName => {
            console.log('Flavor initialization started: ' + flavorName);
            resolvedFlavorName = flavorName;
            return './flavors/' + flavorName + '/';
        })
        .then(flavorPath => {
            return fs.openAsync(flavorPath, 'r')
                .then(() => Promise.resolve(flavorPath))
                .catch(() => {
                    throw Error("Can't find flavor at path: " + path.resolve(flavorPath))
                })
        })
        .then((flavorPath) => {
            console.log(flavorPath);

            console.log('Flavor creating symlink.');
            return new Promise((resolve, reject) => {
                vfs.src([flavorPath + '*.*'])
                    .pipe(map(log))
                    .pipe(vfs.symlink('./flavors/' + 'current/'))
                    .on('finish', () => {
                        console.log('Flavor initialization completed.');
                        resolve();
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
            });
        })
        .catch((error) => {
            console.error(chalk.red(error));
            process.exit(1);
        })
        .then(() => Promise.resolve(resolvedFlavorName));
}

function log(file, cb) {
    console.log(file.path);
    cb(null, file);
}

module.exports = {
    setup: setup,
    run: run
};


