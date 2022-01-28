/**
 * 返回工作区的绝对路径
 * @returns {Array<string>}
 */
async function getWorkspaces() {
  const globby = require("globby");
  const fsPromise = require("fs/promises");
  const fs = require("fs");
  const path = require("path");
  const yaml = require("yaml");

  const workspacesConfigFilePath = path.resolve(
    process.cwd(),
    "pnpm-workspace.yaml"
  );

  const workspacesConfig = yaml.parse(
    await fsPromise.readFile(workspacesConfigFilePath, "utf8")
  );

  const dirs = await globby(workspacesConfig.packages, {
    onlyFiles: false,
    gitignore: true,
  });

  return dirs.filter((dir) => {
    return fs.existsSync(path.join(dir, "package.json"));
  });
}

/**
 * 返回工作区名称列表
 * @returns {Array<string>}
 */
async function getWorkspaceNames() {
  const path = require("path");
  const fs = require("fs/promises");
  const workspaces = await getWorkspaces();

  return Promise.all(
    workspaces.map(async (packagePath) => {
      const pkgPath = path.join(packagePath, "package.json");
      const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
      return pkg.name;
    })
  );
}

/**
 * 判断是否是workspaces包
 * @param {string} depName
 */
async function isWorkspacesPackage(packageName) {
  const workspaceNames = await getWorkspaceNames();
  return workspaceNames.includes(packageName);
}

/**
 * 返回整个workspaces的版本
 * @returns 整个workspaces的版本
 */
async function getWorkspaceVersion() {
  const fs = require("fs/promises");
  const path = require("path");
  const rootPkg = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "package.json"), "utf-8")
  );
  return rootPkg.version;
}

module.exports = {
  getWorkspaces,
  getWorkspaceNames,
  isWorkspacesPackage,
  getWorkspaceVersion,
};
