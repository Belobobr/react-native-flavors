module.exports = function makeBuildPatch(name) {
    const installPattern = new RegExp(`\\s*${name} {\\s*\\n\\s*applicationIdSuffix "\\.${name}"\\s*\\n\\s*versionNameSuffix "-${name}"\\s*\\n\\s*}\\s*`);

    return {
        installPattern,
        pattern: /\s+productFlavors {\s*\n/,
        alternativePattern: /\s+android {\s*\n/,
        patch: `\t\t${name} {\n` +
        `\t\t\tapplicationIdSuffix ".${name}"\n` +
        `\t\t\tversionNameSuffix "-${name}"\n` +
        `\t\t}\n`,
        alternativePatch: '\tproductFlavors {\n' +
        `\t\t${name} {\n` +
        `\t\t\tapplicationIdSuffix ".${name}"\n` +
        `\t\t\tversionNameSuffix "-${name}"\n` +
        `\t\t}\n` +
        `\t}\n`
    };
};