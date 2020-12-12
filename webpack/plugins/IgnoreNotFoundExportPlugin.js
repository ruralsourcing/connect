const ModuleDependencyWarning = require("webpack/lib/ModuleDependencyWarning");

/**
 * IgnoreNotFoundExportPlugin works around typescript interface exports.
 *
 * After TypeScript transpilation, interfaces no longer exist, and so the
 * warning is technically correct, and thus webpack complains, yet there
 * are no runtime errors, and so it should be ignored to reduce terminal
 * output clutter.
 */
module.exports = class IgnoreNotFoundExportPlugin {
  apply(compiler) {
    const messageRegExp = /export '.*'( \(reexported as '.*'\))? was not found in/;
    function doneHook(stats) {
      stats.compilation.warnings = stats.compilation.warnings.filter(function (
        warn
      ) {
        if (
          warn instanceof ModuleDependencyWarning &&
          messageRegExp.test(warn.message)
        ) {
          return false;
        }
        return true;
      });
    }
    if (compiler.hooks) {
      compiler.hooks.done.tap("IgnoreNotFoundExportPlugin", doneHook);
    } else {
      compiler.plugin("done", doneHook);
    }
  }
};
