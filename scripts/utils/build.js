/**
 * 读取包的构建配置
 * @param {string} packagePath
 * @returns {Object}
 */
async function getBuildOptions(packagePath) {
  const fs = require("fs");
  const fsp = require("fs/promises");
  const path = require("path");

  const configFilePath = path.join(packagePath, "package.json");

  if (fs.existsSync(configFilePath)) {
    // 查找当前包的workspace的package.json
    const pkg = await fsp.readFile(configFilePath, "utf-8");
    // 读取构建配置
    return JSON.parse(pkg).buildOptions;
  }
  return null;
}

module.exports = {
  getBuildOptions,
};
