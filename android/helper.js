//TODO use getterForApplicationId in regexp as well.

function makeFlavorPatch(flavorName) {
    const installPattern = new RegExp(`\\s*${flavorName} {\\s*\\n\\s*applicationIdSuffix "\\.${getApplicationIdSuffix(flavorName)}"\\s*\\n\\s*versionNameSuffix "-${flavorName}"\\s*\\n\\s*}\\s*`);

    return {
        installPattern,
        pattern: /\s+productFlavors {\s*\n/,
        alternativePattern: /\s+android {\s*\n/,
        patch: `\t\t${flavorName} {\n` +
        `\t\t\tapplicationIdSuffix ".${getApplicationIdSuffix(flavorName)}"\n` +
        `\t\t\tversionNameSuffix "-${flavorName}"\n` +
        `\t\t}\n`,
        alternativePatch: '\tproductFlavors {\n' +
        `\t\t${flavorName} {\n` +
        `\t\t\tapplicationIdSuffix ".${getApplicationIdSuffix(flavorName)}"\n` +
        `\t\t\tversionNameSuffix "-${flavorName}"\n` +
        `\t\t}\n` +
        `\t}\n`
    };
}

function getApplicationIdSuffix(flavorName) {
    return flavorName;
}

module.exports = {
    makeFlavorPatch: makeFlavorPatch,
    getApplicationIdSuffix: getApplicationIdSuffix,
};


