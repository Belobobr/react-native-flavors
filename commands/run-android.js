#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const helper = require('./../android/helper');
const child_process = require('child_process');

//TODO must start proper activity
//TODO specify build type
//TODO watchman must observe changes in flavor directory and copy them to current
function setup() {
    program
        .command('run-android')
        .description('run application on android for current flavor')
        .alias('ra')
        .arguments('[flavorName]')
        .action(flavorName => {
            console.log(flavorName);


            //TODO don't hardcode build types
            //TODO User need to have opportunity to choose create new flavor or not (if not present).
            initFlavor('Android', flavorName, 'beta')
                .then(flavorName => {
                    console.log('run-android for flavor: ' + flavorName);
                    let cmd = 'react-native';

                    try {
                        child_process.execFileSync(cmd, [
                            `run-android`,
                            `--variant=${flavorName}Debug`,
                        ], {
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


