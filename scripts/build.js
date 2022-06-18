const { getWorkspaces } = require("./utils/workspaces");
const execa = require("execa");
const path = require("path");
const { Extractor, ExtractorConfig } = require("@microsoft/api-extractor");
const rimraf = require("rimraf");
const { Logger } = require("./utils/logger");

const logger = new Logger("BUILD");

(async () => {
  logger.success(`开始打包...`);

  if (process.env.DEBUG) {
    logger.info("当前运行在Debug模式下，会生成source-map进行调试");
  }

  // 获取workspaces路径列表
  const workspaces = await getWorkspaces();

  try {
    await buildAll(workspaces);
  } catch (error) {
    logger.error(error);
  }
})();

async function buildAll(workspaces) {
  let finishCount = 0;

  try {
    await Promise.allSettled(
      workspaces.map(async (packagePath) => {
        logger.success(packagePath, " -> ", `开始打包`);
        // 包的绝对路径
        const absolutePath = path.resolve(process.cwd(), packagePath);
        // 清理之前构建的产物
        await clean(packagePath, absolutePath);
        // 执行构建
        await build(packagePath, absolutePath);
        // 打包d.ts文件
        await rollupDTS(packagePath, absolutePath);

        finishCount++;

        logger.success(
          packagePath,
          " -> ",
          `打包完成，当前进度${finishCount}/${workspaces.length}`
        );
      })
    );
  } catch (error) {
    throw error;
  } finally {
    const isFinish = finishCount === workspaces.length;

    logger.newLine();

    if (isFinish) {
      logger.success("所有包打包完成!");
    } else {
      logger.warning(
        `打包完成, 成功: ${finishCount}个, 失败: ${
          workspaces.length - finishCount
        }个`
      );
    }
  }
}

async function build(packagePath, absolutePath) {
  logger.info(packagePath, " -> ", "开始打包源文件");
  // 使用rollup构建出ts产物
  await execa("rollup", ["--config", "rollup.config.js"], {
    // 指定子进程的env
    env: {
      WORKSPACE: absolutePath,
      DEBUG: process.env.DEBUG,
    },
    // 不继承父进程的env
    extendEnv: false,
    stdout: "inherit",
  });

  logger.success(packagePath, " -> ", "源文件打包完成");
}

async function clean(packagePath, absolutePath) {
  logger.warning(packagePath, `正在清理构建产物...`);

  const outputPath = path.resolve(absolutePath, "dist");
  await new Promise((resolve) => {
    rimraf(outputPath, resolve);
  });

  logger.success(packagePath, `清理完成!`);
}

/**
 * 使用api-extractor生成.d.ts文件
 */
async function rollupDTS(packagePath, absolutePath) {
  logger.info(packagePath, " -> ", "API Extractor 开始打包.d.ts文件");

  const apiExtractorJsonPath = path.join(absolutePath, "./api-extractor.json");
  const extractorConfig =
    ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
  // 使用api-extractor去构建包的ts文件
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  });

  if (extractorResult.succeeded) {
    logger.success(packagePath, " -> ", `API Extractor 打包完成`);
  } else {
    logger.error(
      packagePath,
      " -> "`API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`
    );
    process.exitCode = 1;
  }
  // 清理rollup-plugin-typescript2打包的.d.ts中间产物
  await new Promise((resolve) => {
    rimraf(path.join(absolutePath, "./dist/packages"), resolve);
  });
}
