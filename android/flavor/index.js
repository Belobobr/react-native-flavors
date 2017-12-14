const chalk = require('chalk');
const fs = require("fs");
const applyPatch = require('../applyPatch');

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


function makeFlavorPatch(flavorName) {
    const installPattern = new RegExp(`\\s*${flavorName} {\\s*\\n\\s*applicationId "${getApplicationId(flavorName)}"\\s*\\n\\s*}\\s*`);

    return {
        installPattern,
        pattern: /\s+productFlavors {\s*\n/,
        alternativePattern: /\s+android {\s*\n/,
        patch: `\t\t${flavorName} {\n` +
        `\t\t\tapplicationId "${getApplicationId(flavorName)}"\n` +
        `\t\t}\n`,
        alternativePatch: '\tproductFlavors {\n' +
        `\t\t${flavorName} {\n` +
        `\t\t\tapplicationId "${getApplicationId(flavorName)}"\n` +
        `\t\t}\n` +
        `\t}\n`
    };
}

function getApplicationId(flavorName) {
    return `com.${flavorName}.mw.client.mobile`;
}


