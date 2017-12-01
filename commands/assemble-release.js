#!/usr/local/bin/node --harmony
var program = require('commander');

function setup() {
    program
        .command('assemble-release <platform>')
        .description('assemble release build for current flavor and platform')
        .alias('ar')
}

module.exports = {
    setup: setup
};


