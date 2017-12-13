const path = require('path');
const Promise = require('bluebird');
const fs = require('fs-extra');
const ProjectConfig = require('./../../react-native-cli/core');
Promise.promisifyAll(fs);
const linkAndroidFlavor = require('./../../android/index');

function linkNativeFlavors(flavorName) {
    console.log('Config: ' + ProjectConfig);
    let config = ProjectConfig.get();
    console.log('Link native flavors');
    return linkAndroidFlavor(config.android, flavorName);
}

function configureJavascriptFlavors(flavorName) {
    console.log("configureJavascriptFlavors[flavorName] = " + flavorName);

    const CURRENT = './flavors/current';

    return Promise.resolve(flavorName)
        .then(flavorName => {
            return './flavors/' + flavorName + '/';
        })
        .then(flavorPath => {
            return fs.openAsync(flavorPath, 'r')
                .then(() => Promise.resolve(flavorPath))
                .catch(() => {
                    throw Error("Can't find flavor at path: " + path.resolve(flavorPath))
                })
        })
        .then(flavorPath => {
            return fs.remove(CURRENT)
                .then(() => Promise.resolve(flavorPath))
                .catch(() => {
                    throw Error("Can't remove previously created symlink at path: " + path.resolve(flavorPath))
                })
        })
        .then((flavorPath) => {
            console.log('Flavor copying src to current.');
            return fs.copy(path.resolve(flavorPath), path.resolve('./flavors/current'))
                .then(() => {
                    console.log('Flavor initialization completed.');
                    return Promise.resolve(flavorName);
                })
                .catch((error) => {
                    return Promise.reject(error);
                })
        })
}

module.exports = {
    configureJavascriptFlavors,
    linkNativeFlavors
};