#!/usr/local/bin/node --harmony
var program = require('commander');

function setup() {
    program
        .command('assemble-debug <platform>')
        .description('assemble debug build for current flavor and platform')
        .alias('ad')
}

module.exports = {
    setup: setup
};
