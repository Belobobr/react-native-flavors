// const path = require('path');
// const isWin = process.platform === 'win32';
//
// module.exports = function makeSettingsPatch(name, androidConfig, projectConfig) {
//     var projectDir = path.relative(
//         path.dirname(projectConfig.settingsGradlePath),
//         androidConfig.sourceDir
//     );
//
//     /*
//      * Fix for Windows
//      * Backslashes is the escape character and will result in
//      * an invalid path in settings.gradle
//      * https://github.com/rnpm/rnpm/issues/113
//      */
//     if (isWin) {
//         projectDir = projectDir.replace(/\\/g, '/');
//     }
//
//     return {
//         pattern: '\n',
//         patch: `include ':${name}'\n` +
//         `project(':${name}').projectDir = ` +
//         `new File(rootProject.projectDir, '${projectDir}')\n`,
//     };
// };
//
// const applyParams = require('./applyParams');
//
// module.exports = function makePackagePatch(packageInstance, params, prefix) {
//     const processedInstance = applyParams(packageInstance, params, prefix);
//
//     return {
//         pattern: 'new MainReactPackage()',
//         patch: ',\n            ' + processedInstance,
//     };
// };
//
// module.exports = function makeBuildPatch(name) {
//     const installPattern = new RegExp(
//         `\\s{4}(compile)(\\(|\\s)(project)\\(\\\':${name}\\\'\\)(\\)|\\s)`
//     );
//
//     return {
//         installPattern,
//         pattern: /[^ \t]dependencies {\n/,
//         patch: `    compile project(':${name}')\n`
//     };
// };
//
//
