//TODO use getterForApplicationId in regexp as well.

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

module.exports = {
    makeFlavorPatch,
    getApplicationId
};


