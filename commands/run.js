#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const child_process = require('child_process');

//TODO must start proper activity
//TODO watchman must observe changes in flavor directory and copy them to current
function setup() {
    program
        .command('run')
        .description('run application on android for current flavor')
        .alias('ra')
        .arguments('<task>')
        .action((task) => {
            initFlavor(task)
                .then(([platform, flavorName, buildType]) => {
                    console.log(`run for platform: ${platform} flavor: ${flavorName} buildType: ${buildType}`);

                    if (platform.toLowerCase() === 'android') {
                        let cmd = 'react-native';

                        try {
                            child_process.execFileSync(cmd, [
                                `run-android`,
                                `--variant=${flavorName}${buildType.name}`,
                                `--appIdSuffix=${buildType.name}`
                            ], {
                                stdio: [process.stdin, process.stdout, process.stderr],
                            });
                        } catch (error) {
                            // console.log(error);
                        }
                    } else {
                        console.log('run ios not implemented');
                    }
                });
        })
}

module.exports = {
    setup: setup
};


