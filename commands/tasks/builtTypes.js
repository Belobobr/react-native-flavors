const Promise = require('bluebird');
const fs = require('fs-extra');
const ProjectConfig = require('./../../react-native-cli/core');
Promise.promisifyAll(fs);
const linkAndroidBuildType = require('../../android/buildType/index');

function linkNativeBuildType(buildType) {
    console.log('Config: ' + ProjectConfig);
    let config = ProjectConfig.get();
    console.log('Link build type: ' + JSON.stringify(buildType));
    return linkAndroidBuildType(config.android, buildType);
}

module.exports = {
    linkNativeBuildType
};