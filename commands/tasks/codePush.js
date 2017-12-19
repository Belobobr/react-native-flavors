#!/usr/bin/env --harmony
const Promise = require('bluebird');
const fs = require('fs-extra');
const CodePush = require("code-push");
Promise.promisifyAll(fs);
const config = require('./config');

function configureCodePush(platform, flavorName, buildType) {
    let codePushTokenId;

    return config.getCodePushTokenId()
        .then(tokenId => codePushTokenId = tokenId)
        .then(codePushTokenId => resolveDeployment(flavorName, buildType, platform, codePushTokenId))
        .then(defaultDeployment => resolveDeploymentInfo(buildType, platform, defaultDeployment, codePushTokenId))
        .then(deploymentInfo => updateFlavorWithDeploymentInfo(flavorName, deploymentInfo))
        .catch(error => {
            console.log('Configure code push error: ' + JSON.stringify(error));
            throw Error(error);
        })
}

//TODO script should update server configuration to correspound config.json
function resolveDeployment(flavorName, buildType, platform, codePushTokenId) {
    //1) Создать прилоежния если они не созданы на сервере
    //2) Создать деплоймент зависимости от buildType если не созданы
    //3) Вернуть дефолтный деплоймент для flavor, buildType и platform
    const codePush = new CodePush(codePushTokenId);

    return codePush.getApps()
        .then(applications => resolveApplication(applications, platform, flavorName, codePush))
        .then(application => resolveDeploymentForApplication(application, buildType, codePush))
}

function resolveApplication(applications, platform, flavorName, codePush) {
    const applicationName = getApplicationNameForFlavorAndOs(flavorName, platform);

    let application = applications.find(application => application.name.toLowerCase() === applicationName.toLowerCase());

    if (!application) {
        console.log(`Creating application on code push server: ${applicationName}`);
    }

    let createApplicationPromise = codePush.addApp(applicationName, platform, 'React-Native', true);

    return !application ? createApplicationPromise : Promise.resolve(application);
}

function resolveDeploymentForApplication(application, buildType, codePush) {
    console.log(JSON.stringify(application));
    return codePush.getDeployments(application.name)
        .then((deployments) => {
            const deploymentName = buildType.deployment || buildType.name;

            let deployment = deployments.find(deployment => deployment.name === deploymentName);

            if (!deployment) {
                console.log(`Creating deployment on code push server: ${deploymentName}`);
            }

            let createDeploymentPromise = codePush.addDeployment(application.name, deploymentName);

            return !deployment ? createDeploymentPromise : Promise.resolve(deployment);
        });
}

function getApplicationNameForFlavorAndOs(flavorName, os) {
    return `com.${flavorName}.mw.client.mobile.${os}`;
}

function resolveDeploymentInfo(buildType, platform, defaultDeployment, codePushTokenId) {
    console.log('Resolve deployment info: ' + JSON.stringify(buildType));

    if (!buildType.allDeployments) {
        return {
            defaultKey: defaultDeployment.key
        }
    }

    console.log('all deployments');

    return config.getFlavors()
        .then(flavors => Promise.all(flavors.map(
            flavorName => resolveDeploymentDescription(flavorName, buildType, platform, codePushTokenId)
        )))
        .then(deployments => {
            console.log('All deployments resolved.');
            return {
                defaultKey: defaultDeployment.key,
                deployments: deployments
            }
        });
}

function resolveDeploymentDescription(flavorName, buildType, platform, codePushTokenId) {
    return resolveDeployment(flavorName, buildType, platform, codePushTokenId)
        .then(deployment => Object.assign({flavorName: flavorName}, deployment))
}

function updateFlavorWithDeploymentInfo(flavorName, deploymentInfo) {
    let deploymentInfoFile = JSON.stringify(deploymentInfo, null, "\t");

    return fs.writeFileAsync(`./flavors/${flavorName}/deploymentInfo.json`, deploymentInfoFile);
}

module.exports = {
    configureCodePush
};
