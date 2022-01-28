/**
 * 符号链接Debug
 * 主要用在其他项目中调试本项目的包
 * 脚本做的事情：
 * - 将所有包都链接到本地的全局仓库，使得其他项目装包的时候可以直接将版本链接到本地环境
 * - 产出命令，复制到宿主项目，并将该项目的包链接到宿主项目中调试功能
 */
const execa = require("execa");
const { getWorkspaces, getWorkspaceNames } = require("./utils/workspaces");
const chalk = require("chalk");
const path = require("path");

const COMMAND = chalk.black.bgGreen("DEV:LINK");

(async () => {
  const workspaces = await getWorkspaces();
  const packageNames = await getWorkspaceNames();

  if (!workspaces.length) {
    console.log("没有可用的package!");
    process.exit(0);
  }

  await linkPackageToLocalRegistry(workspaces);

  console.log(`${COMMAND} 链接完成`);

  console.log(`${COMMAND}

    在具体的项目中运行如下命令，将包链接到其他项目使用本库包:

    ${chalk.green(getLinkCommand(packageNames))}

    调试完成后，请将宿主项目的包还原成读取远程仓库的包:

    第一步: ${chalk.red(`${getUnLinkCommand(packageNames)}`)}

    第二步: ${chalk.red(`yarn install`)}

    `);
})();

/**
 * 链接包至本机仓库
 */
function linkPackageToLocalRegistry(workspaces) {
  return Promise.all(
    workspaces.map(async (packagePath) => {
      await execa.command("yarn link", {
        cwd: path.join(process.cwd(), packagePath),
      });
    })
  );
}

/**
 * 返回link命令
 */
function getLinkCommand(packageNames) {
  return `yarn link ${packageNames.join(" ")} `;
}

function getUnLinkCommand(packageNames) {
  return `yarn link ${packageNames.join(" ")} `;
}
