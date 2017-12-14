const path = require('path');
const Promise = require('bluebird');
const fs = require('fs-extra');
Promise.promisifyAll(fs);

const CONFIG_PATH = './flavors/config.json';

function resolveFlavorName(argFlavorName) {
    return fs.readFileAsync(CONFIG_PATH, 'utf8')
        .catch(() => {
            throw Error("Can't find flavor config at path: " + path.resolve(CONFIG_PATH))
        })
        .then(data => JSON.parse(data))
        .then(config => {
            if (!config.flavors || config.flavors.length === 0) {
                throw Error('Flavors not specified in config.json.')
            }

            let flavorName;
            if (!argFlavorName) {
                flavorName = config.flavors[0];
            } else {
                flavorName = config.flavors.find(flavorName => flavorName.toLowerCase() === argFlavorName.toLowerCase());
                if (!flavorName) {
                    throw Error('Flavor not specified in config.json');
                }
            }

            console.log('Resolved flavorName: ' + flavorName);
            return flavorName;
        })
}

function resolveBuildType(argBuildType) {
    return fs.readFileAsync(CONFIG_PATH, 'utf8')
        .catch(() => {
            throw Error("Can't find flavor config at path: " + path.resolve(CONFIG_PATH))
        })
        .then(data => JSON.parse(data))
        .then(config => {
            if (!config.buildTypes || config.buildTypes.length === 0) {
                throw Error('Build types not specified in config.json.')
            }

            let buildType;
            if (!argBuildType) {
                buildType = config.buildTypes[0];
            } else {
                buildType = config.buildTypes.find(buildType => buildType.name.toLowerCase() === argBuildType.toLowerCase());
                if (!buildType) {
                    throw Error('Build type not specified in config.json');
                }
            }

            console.log('Resolved buildType: ' + buildType);
            return buildType;
        })
}

function resolvePlatform(argPlatform) {
    //TODO validate platform-name
    return Promise.resolve(argPlatform);
}

function resolveCodePushTokenId() {
    return fs.readFileAsync(CONFIG_PATH, 'utf8')
        .catch(() => {
            throw Error("Can't find flavor config at path: " + path.resolve(CONFIG_PATH))
        })
        .then(data => JSON.parse(data))
        .then(config => {
            if (!config.codePushTokenId) {
                throw Error('Code push token id not specified.');
            }
            return config.codePushTokenId;
        })
}

module.exports = {
    resolveFlavorName,
    resolveBuildType,
    resolveCodePushTokenId,
    resolvePlatform
};