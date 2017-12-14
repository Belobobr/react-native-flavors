#!/usr/local/bin/node --harmony
const program = require('commander');
const {run: initFlavor} = require('./init');
const child_process = require('child_process');

function setup() {
    program
        .command('assemble')
        .description('assemble build for current platform, flavor and buildType')
        .alias('ass')
        .arguments('<task>')
        .action(task => {
            initFlavor(task)
                .then(([platform, flavorName, buildType]) => {
                    console.log(`assemble for platform: ${platform} flavor: ${flavorName} buildType: ${buildType}`);

                    if (platform.toLowerCase() === 'android') {
                        let cmd = `cd android && ./gradlew assemble${flavorName}${buildType}`;

                        try {
                            child_process.execSync(cmd,{
                                stdio: [process.stdin, process.stdout, process.stderr],
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        console.info('assemble for ios not implemented yet');
                    }
                });
        })
}

module.exports = {
    setup: setup
};
