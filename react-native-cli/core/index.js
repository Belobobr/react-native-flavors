//TODO from react-native cli
const android = require('./android');
const findAssets = require('./findAssets');
const ios = require('./ios');
const windows = require('./windows');
const path = require('path');

const getRNPMConfig = (folder) =>
    // $FlowFixMe non-literal require
    require(path.join(folder, './package.json')).rnpm || {};

const defaultRNConfig = {
    getProjectConfig() {
        const folder = process.cwd();
        const rnpm = getRNPMConfig(folder);

        return Object.assign({}, rnpm, {
            ios: ios.projectConfig(folder, rnpm.ios || {}),
            android: android.projectConfig(folder, rnpm.android || {}),
            windows: windows.projectConfig(folder, rnpm.windows || {}),
            assets: findAssets(folder, rnpm.assets),
        });
    },

};

/**
 * Loads the CLI configuration
 */
function getCliConfig() {
    return {get: defaultRNConfig.getProjectConfig};
}

module.exports = getCliConfig();
