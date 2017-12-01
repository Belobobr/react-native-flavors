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
        .arguments('<name>')
        .action(flavorName => run(flavorName));
}

function run(flavorName) {
    console.log('Flavor initialization started: ' + flavorName);
    let flavorPath = './flavors/' + flavorName + '/';

    fs.openAsync(flavorPath, 'r')
        .then(() => Promise.resolve(flavorPath))
        .catch(() => {
            let flavorAbsolutePath = path.resolve(flavorPath);
            return Promise.reject(new Error("Can't find flavor at path: " + flavorAbsolutePath));
        })
        .then((flavorPath) => {
            console.log('Flavor creating symlink');
            return new Promise((resolve, reject) => {
                vfs.src([flavorPath + '*.*'])
                    .pipe(map(log))
                    .pipe(vfs.symlink('./flavors/' + 'current/'))
                    .on('finish', () => {
                        console.log('Flavor initialization completed: ' + flavorName);
                        resolve();
                    })
                    .on('error', (error) => {
                        console.log('Error: ' + flavorName);
                        reject(error);
                    })
            });
        })
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


