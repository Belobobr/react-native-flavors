#!/usr/local/bin/node --harmony
const program = require('commander');
const init = require('./init');
const child_process = require('child_process');

function setup() {
    program
        .command('run-android')
        .description('run application on android for current flavor')
        .alias('ra')
        .action(function (flavorName) {
            var cmd = 'react-native';

            try {
                child_process.execFileSync(cmd, ['run-android'], {
                    stdio: [process.stdin, process.stdout, process.stderr],
                });
            } catch (error) {

            }
        })
}

module.exports = {
    setup: setup
};


