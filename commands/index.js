#!/usr/local/bin/node --harmony
const commands = [
    require('./init'),
    require('./assemble-release'),
    require('./assemble-debug'),
    require('./run-ios'),
    require('./run-android'),
    require('./publish'),
    require('./init-code-push')
];

module.exports = commands;
