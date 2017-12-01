#!/usr/local/bin/node --harmony
var program = require('commander');

function setup() {
    program
        .command('run-ios')
        .description('run application on ios for current flavor')
        .alias('ri')
}

module.exports = {
    setup: setup
};
