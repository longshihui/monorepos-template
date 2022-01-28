const { getWorkspaces } = require("./utils/workspaces");
const execa = require("execa");
const chalk = require("chalk");
const path = require("path");

const COMMAND = ` ${chalk.black.bgGreen(" BUILD ")} `;

(async () => {
  console.log(`${COMMAND} ${chalk.yellow("开始打包...")}`);

  if (process.env.DEBUG) {
    console.log(
      `${COMMAND} ${chalk.yellow(
        "当前运行在Debug模式下，会生成source-map进行调试"
      )}`
    );
  }

  // 获取workspaces路径列表
  const workspaces = await getWorkspaces();
  let finishCount = 0;
  try {
    await Promise.all(
      workspaces.map(async (packagePath) => {
        const absolutePath = path.resolve(process.cwd(), packagePath);

        await execa("webpack", {
          preferLocal: true,
          // 查找可执行二进制文件的路径
          localDir: process.cwd(),
          // 指定子进程的工作目录
          cwd: process.cwd(),
          // 指定子进程的env
          env: {
            TARGET_PACKAGE: absolutePath,
            DEBUG: process.env.DEBUG,
          },
          // 不继承父进程的env
          extendEnv: false,
          stdout: "inherit",
        });

        finishCount++;

        console.log(
          `${COMMAND} 工作区${chalk.yellow(packagePath)} -> ${chalk.green(
            "打包完成!"
          )}，当前进度${chalk.green(`${finishCount}/${workspaces.length}`)}`
        );
      })
    );

    console.log(`${COMMAND} ${chalk.green("打包完成!")}`);
  } catch (error) {
    console.log(error.stderr);
  }
})();
