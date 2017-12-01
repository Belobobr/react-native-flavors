#!/usr/bin/env babel-node
const program = require('commander');
const commands = require('./commands');

program
    .version('0.0.1')
    .description('Flavors manager for react-native');

commands.forEach(function(cmd) {
    cmd.setup()
});

program.parse(process.argv);