const fs = require('fs');

module.exports = function applyPatch(file, patch) {
    const patternPresent = defaultPatternPresent(file, patch);
    const chosenPattern = patternPresent ? patch.pattern : patch.alternativePattern;
    const chosenPatch = patternPresent ? patch.patch : patch.alternativePatch;

    fs.writeFileSync(file, fs
        .readFileSync(file, 'utf8')
        .replace(chosenPattern, match => `${match}${chosenPatch}`)
    );
};

function defaultPatternPresent(file, patch) {
    const buildGradle = fs.readFileSync(file, 'utf8');
    return patch.pattern.test(buildGradle);
}
