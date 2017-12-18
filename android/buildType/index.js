const chalk = require('chalk');
const fs = require("fs");
const applyPatch = require('../applyPatch');

//TODO sign application, setup application icon, setup strings and other resources from flavor config
module.exports = function linkAndroidBuildType(androidProjectConfig, buildType) {
    //TODO for bundling assets in different build type we need to edit app.gralde
    //bundleInBeta: true // Overriding default configuration

    return new Promise((resolve) => {
        if (!androidProjectConfig) {
            return resolve(buildType);
        }

        const isInstalled = isInstalledAndroidBuildType(androidProjectConfig, buildType);

        if (isInstalled) {
            console.info(chalk.grey(`Android build type ${buildType.name} is already linked`));
            return resolve(buildType);
        }

        console.info(`Linking ${buildType.name} android build type`);
        registerAndroidBuildType(androidProjectConfig, buildType);
        console.info(`Android build type ${buildType.name} has been successfully linked`);
        return resolve(buildType);
    });
};

function isInstalledAndroidBuildType(config, buildType) {
    const buildGradle = fs.readFileSync(config.buildGradlePath, 'utf8');
    console.log(makeBuildTypePatch(buildType).installPattern);
    return makeBuildTypePatch(buildType).installPattern.test(buildGradle);
}

function registerAndroidBuildType(config, buildType) {
    const buildTypePatch = makeBuildTypePatch(buildType);
    applyPatch(config.buildGradlePath, buildTypePatch);
}


function makeBuildTypePatch(buildType) {
    const installPattern = new RegExp(`\\s*${buildType.name} {\\s*\\n`);

    return {
        installPattern,
        pattern: /\s+buildTypes {\s*\n/,
        alternativePattern: /\s+android {\s*\n/,
        patch: `\t\t${buildType.name} {\n` +
        (!!buildType.suffix ? `\t\t\tapplicationIdSuffix ".${buildType.name}"\n` : ``) +
        `\t\t}\n`,
        alternativePatch: '\tbuildTypes {\n' +
        `\t\t${buildType.name} {\n` +
        (!!buildType.suffix ? `\t\t\tapplicationIdSuffix ".${buildType.name}"\n` : ``) +
        `\t\t}\n` +
        `\t}\n`
    };
}



