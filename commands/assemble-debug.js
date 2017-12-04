#!/usr/local/bin/node --harmony
const program = require('commander');

function setup() {
    program
        .command('assemble-debug [platform] [flavor]')
        .description('assemble debug build for current flavor and platform')
        .alias('ad')
        .arguments('[flavorName]')
}

module.exports = {
    setup: setup
};
