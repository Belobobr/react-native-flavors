#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const child_process = require('child_process');

function setup() {
    program
        .command('run-android')
        .description('run application on android for current flavor')
        .alias('ra')
        .arguments('[flavorName]')
        .action(flavorName => {
            console.log(flavorName);

            initFlavor(flavorName)
                .then(flavorName => {
                    console.log('run-android for flavor: ' + flavorName);
                    let cmd = 'react-native';

                    try {
                        child_process.execFileSync(cmd, ['run-android', '--variant=' + flavorName], {
                            stdio: [process.stdin, process.stdout, process.stderr],
                        });
                    } catch (error) {
                        // console.log(error);
                    }
                });
        })
}

module.exports = {
    setup: setup
};


