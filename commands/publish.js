#!/usr/local/bin/node --harmony

var program = require('commander');

function setup() {
    program
        .command('publish')
        .description('publish the bundle.js')
        .alias('p')
}

module.exports = {
    setup: setup
};