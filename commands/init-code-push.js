#!/usr/bin/env --harmony
const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = require('fs-extra');
const CodePush = require("code-push");
Promise.promisifyAll(fs);

const CONFIG_PATH = './flavors/config.json';

//TODO accept flavor path from command line
function setup() {
    program
        .command('init-code-push')
        .description('init code push application and deployments')
        .alias('icp')
        .arguments('[flavorName]')
        .action(flavorName => run(flavorName));
}

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

function configureCodePushServer(flavorName) {
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
        .then(codePushTokenId => {
            console.log(codePushTokenId);
            let codePush = new CodePush(codePushTokenId);

            codePush.getApps()
                .then(applications => createApplicationsOnCodePushServerIfNeeded(applications, flavorName, codePush))
                .then(createdApps => createDeploymentsForApps(createdApps, codePush))
                .then(deploymentInfo => updateFlavorWithDeploymentInfoForFlavor(deploymentInfo, flavorName))
                .catch(error => console.log(error))
        })
}

function createApplicationsOnCodePushServerIfNeeded(applications, flavorName, codePush) {
    const androidAppName = `webtv-${flavorName}-mobile-android`;
    const iosAppName = `webtv-${flavorName}-mobile-ios`;

    let createAppsPromises = [];
    console.log(JSON.stringify(applications));
    if (!applications.find(application => application.name === androidAppName)) {
        console.log(`Creating application on code push server: ${androidAppName}`);
        createAppsPromises.push(codePush.addApp(androidAppName, 'Android', 'React-Native', true));
    } else {
        console.info(chalk.grey(`${androidAppName} is already created`));
    }
    if (!applications.find(application => application.name === iosAppName)) {
        console.log(`Creating application on code push server: ${iosAppName}`);
        createAppsPromises.push(codePush.addApp(iosAppName, 'iOS', 'React-Native', true));
    } else {
        console.info(chalk.grey(`${iosAppName} is already created`));
    }

    return Promise.all(createAppsPromises);
}

//TODO specify deployments thought config json
function createDeploymentsForApps(applications, codePush) {
    console.log(applications);
    let createDeploymentsPromises = [];

    applications.forEach(application => {
        let createDeploymentsForApp = [];

        createDeploymentsForApp.push(
            codePush.addDeployment(application.name, 'beta')
        );
        createDeploymentsForApp.push(
            codePush.addDeployment(application.name, 'release')
        );

        createDeploymentsPromises.push(
            Promise.all(createDeploymentsForApp).then(deployments => {
                return {
                    application,
                    deployments
                }
            })
        )
    });

    return Promise.all(createDeploymentsPromises);
}

function updateFlavorWithDeploymentInfoForFlavor(deploymentInfo, flavorName) {
    return fs.writeFileAsync(`./flavors/${flavorName}/deploymentInfo.js`, JSON.stringify(deploymentInfo));
}

function run(argFlavorName) {
    console.log("init-code-push: run: " + argFlavorName);

    return resolveFlavorName(argFlavorName)
        .then(configureCodePushServer)
        .catch((error) => {
            console.error(chalk.red(error));
            process.exit(1);
        })

}

module.exports = {
    setup: setup,
    run: run
};


