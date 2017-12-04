#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const child_process = require('child_process');

function setup() {
    program
        .command('assemble-release')
        .description('assemble release build for current flavor and platform')
        .alias('ad')
        .arguments('[platform] [flavorName]')
        .action((platform, flavorName) => {
            console.log(flavorName);

            //TODO User need to have opportunity to choose create new flavor or not (if not present).
            initFlavor(flavorName)
                .then(flavorName => {
                    if (platform.toLowerCase() === 'android') {
                        console.log('assemble-release for flavor: ' + flavorName);
                        let cmd = `cd android && ./gradlew assemble${flavorName}Release`;

                        try {
                            child_process.execSync(cmd,{
                                stdio: [process.stdin, process.stdout, process.stderr],
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.info('assemble-release for ios not implemented yet');
                    }
                });
        })
}

module.exports = {
    setup: setup
};
