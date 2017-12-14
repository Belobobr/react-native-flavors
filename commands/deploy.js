#!/usr/local/bin/node --harmony
const program = require('commander');

function setup() {
    program
        .command('deploy')
        .description('deploy the bundle.js')
        .alias('p')
}

module.exports = {
    setup: setup
};