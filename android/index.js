const chalk = require('chalk');
const fs = require("fs");
const makeFlavorPatch = require('./patches/makeFlavorPatch');
const applyPatch = require('./patches/applyPatch');

//TODO sign application, setup application icon, setup strings and other resources from flavor config
module.exports = function linkAndroidFlavor(androidProjectConfig, flavorName) {
    return new Promise((resolve) => {
        if (!androidProjectConfig) {
            return resolve(flavorName);
        }

        const isInstalled = isInstalledAndroidFlavor(androidProjectConfig, flavorName);

        if (isInstalled) {
            console.info(chalk.grey(`Android flavor ${flavorName} is already linked`));
            return resolve(flavorName);
        }

        console.info(`Linking ${flavorName} android flavor`);
        registerAndroidFlavor(androidProjectConfig, flavorName);
        console.info(`Android flavor ${flavorName} has been successfully linked`);
        return resolve(flavorName);
    });
};

function isInstalledAndroidFlavor(config, name) {
    const buildGradle = fs.readFileSync(config.buildGradlePath, 'utf8');
    return makeFlavorPatch(name).installPattern.test(buildGradle);
}

function registerAndroidFlavor(config, name) {
    const flavorPatch = makeFlavorPatch(name);
    applyPatch(config.buildGradlePath, flavorPatch);
}

