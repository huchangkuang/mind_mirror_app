const { withAppBuildGradle } = require("expo/config-plugins");

const MARKER = "// @generated expo: mind-mirror release apk filename";

/**
 * Release APK 输出为 mind-mirror-{versionName}.apk（versionName 与 app.json expo.version / defaultConfig 一致）
 */
function withAndroidReleaseApkName(config) {
  return withAppBuildGradle(config, (mod) => {
    let contents = mod.modResults.contents;
    if (contents.includes(MARKER)) {
      return mod;
    }

    const snippet = `
    ${MARKER}
    applicationVariants.configureEach { variant ->
        variant.outputs.configureEach { output ->
            output.outputFileName = "mind-mirror-\${variant.versionName}.apk"
        }
    }
`;

    const needle = `    androidResources {
        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
    }`;
    if (contents.includes(needle)) {
      mod.modResults.contents = contents.replace(needle, needle + snippet);
      return mod;
    }

    const beforeDeps = "\ndependencies {";
    if (contents.includes(beforeDeps)) {
      mod.modResults.contents = contents.replace(
        beforeDeps,
        `
${MARKER}
android.applicationVariants.configureEach { variant ->
    variant.outputs.configureEach { output ->
        output.outputFileName = "mind-mirror-\${variant.versionName}.apk"
    }
}
${beforeDeps}`,
      );
    }
    return mod;
  });
}

module.exports = withAndroidReleaseApkName;
