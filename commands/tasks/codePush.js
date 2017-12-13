#!/usr/bin/env --harmony
const Promise = require('bluebird');
const fs = require('fs-extra');
const CodePush = require("code-push");
Promise.promisifyAll(fs);
const {resolveCodePushTokenId} = require('./config');

function configureCodePush([flavorName, buildType, platform]) {
    return resolveCodePushTokenId()
        .then(codePushTokenId => resolveDefaultDeploymentKey(flavorName, buildType, platform, codePushTokenId))
        .then(defaultDeploymentKey => resolveDeploymentInfo(flavorName, buildType, platform, defaultDeploymentKey))
        .then(deploymentInfo => updateFlavorWithDeploymentInfo(flavorName, deploymentInfo))
        .catch(error => {
            console.log('Configure code push error: ' + JSON.stringify(error));
            return new Promise.resolve(flavorName)
        })
        .then(() => new Promise.resolve(flavorName))
}

//TODO script should update server configuration to correspound config.json
function resolveDefaultDeploymentKey(flavorName, buildType, platform, codePushTokenId) {
    //1) Создать прилоежния если они не созданы на сервере
    //2) Создать деплоймент зависимости от buildType если не созданы
    //3) Вернуть дефолтный деплоймент ключ для сборки
    const codePush = new CodePush(codePushTokenId);

    return codePush.getApps()
        .then(applications => {
            const applicationName = getApplicationNameForFlavorAndOs(flavorName, platform);

            let application = applications.find(application => application.name.toLowerCase() === applicationName.toLowerCase());

            if (!application) {
                console.log(`Creating application on code push server: ${applicationName}`);
            }

            let createApplicationPromise = codePush.addApp(applicationName, platform, 'React-Native', true);

            return !application ? createApplicationPromise : Promise.resolve(application);
        })
        .then(application => {
            console.log(JSON.stringify(application));
            return Promise.all([
                application,
                codePush.getDeployments(application.name)
            ])
        })
        .then(([application, deployments])=> {
            const deploymentName = buildType.deployment;

            let deployment = deployments.find(deployment => deployment.name === deploymentName);

            if (!deployment) {
                console.log(`Creating deployment on code push server: ${deploymentName}`);
            }

            let createDeploymentPromise = codePush.addDeployment(application.name, deploymentName);

            return !deployment ? createDeploymentPromise : Promise.resolve(deployment);
        })
        .then(deployment => {console.log(deployment);return deployment.key})
}

function getApplicationNameForFlavorAndOs(flavorName, os) {
    return `webtv-${flavorName}-mobile-${os}`;
}

function resolveDeploymentInfo(flavorName, buildType, platform, defaultDeploymentKey) {
    return {
        defaultKey: defaultDeploymentKey
    };
}

function updateFlavorWithDeploymentInfo(flavorName, deploymentInfo) {
    let deploymentInfoFile = JSON.stringify(deploymentInfo, null, "\t");

    return fs.writeFileAsync(`./flavors/${flavorName}/deploymentInfo.json`, deploymentInfoFile);
}

module.exports = {
    configureCodePush
};
