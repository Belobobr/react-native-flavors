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
            let flavorName = argFlavorName || config.current;
            if (!flavorName) {
                throw Error('Flavor name not specified.');
            }

            if (!config.flavors) {
                throw Error('Flavors not specified in config.json.')
            }

            //ищем в конфиге указанный flavor, не нашли кидаем ошибку
            if (!config.flavors.includes(flavorName)) {
                throw Error('Flavor {' + flavorName + '} not specified in flavors.')
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
                buildType = config.buildTypes.find(buildType => buildType.name === argBuildType);
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