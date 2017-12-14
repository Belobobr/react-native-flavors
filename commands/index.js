#!/usr/local/bin/node --harmony
const commands = [
    require('./init'),
    require('./assemble'),
    require('./run'),
    require('./deploy'),
];

module.exports = commands;
