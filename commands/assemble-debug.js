#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const child_process = require('child_process');

function setup() {
    program
        .command('assemble-debug')
        .description('assemble debug build for current flavor and platform')
        .alias('ad')
        .arguments('[platform] [flavorName]')
        .action((platform, flavorName) => {
            console.log(flavorName);

            //TODO User need to have opportunity to choose create new flavor or not (if not present).
            initFlavor(flavorName)
                .then(flavorName => {
                    if (platform.toLowerCase() === 'android') {
                        let cmd = `cd android && ./gradlew assemble${flavorName}Debug`;
                        console.log('Assembling project: ' + cmd);

                        try {
                            child_process.execSync(cmd,{
                                stdio: [process.stdin, process.stdout, process.stderr],
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.info('assemble-debug for ios not implemented yet');
                    }
                });
        })
}

module.exports = {
    setup: setup
};
