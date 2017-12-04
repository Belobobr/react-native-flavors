#!/usr/local/bin/node --harmony
const program = require('commander');

function setup() {
    program
        .command('run-ios')
        .description('run application on ios for current flavor')
        .alias('ri')
}

module.exports = {
    setup: setup
};
