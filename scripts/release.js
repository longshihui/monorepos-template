/**
 * 此脚本用于处理包的发布流程
 * 1. 选择一个要发布的版本类型
 * 2. 执行单元测试
 * 3. 执行构建操作
 * 3. 更新所有将要发布包的版本号，以及依赖它们的workspace的版本号
 * 4. git分支打版本tag，并提交到远程分支
 * 5. 发布所有的包
 */
const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const semver = require("semver");
const { prompt } = require("enquirer");
const execa = require("execa");
const {
  getWorkspaceVersion,
  getWorkspaces,
  isWorkspacesPackage,
} = require("./utils/workspaces");
const fsp = require("fs/promises");

// 是否只是单纯执行流程，而不做实际的动作
const isDryRun = args.dry;
// 是否跳过单元测试
const skipTests = args.skipTests;
// 是否跳过构建
const skipBuild = args.skipBuild;
// 跳过发布的包
const skippedPackages = [];

const bin = (name) => path.resolve(__dirname, "../node_modules/.bin/" + name);
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: "inherit", ...opts });
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(" ")}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
  const currentVersion = await getWorkspaceVersion();
  const workspaces = await getWorkspaces();
  let nextVersion = "";

  const { release } = await prompt({
    type: "select",
    name: "release",
    message: "选择一个发版的类型",
    choices: ["patch", "minor", "major"],
  });

  nextVersion = semver.inc(currentVersion, release);

  if (!semver.valid(nextVersion)) {
    throw new Error(`无效的新版本: ${nextVersion}`);
  }

  const { yes } = await prompt({
    type: "confirm",
    name: "yes",
    message: `确认发布版本: v${nextVersion}?`,
  });

  if (!yes) {
    return;
  }

  // run tests before release
  step("\n执行单元测试...");
  if (!skipTests && !isDryRun) {
    await run(bin("jest"), ["--clearCache"]);
    await run("yarn", ["test", "--bail"]);
  } else {
    console.log(`(skipped)`);
  }

  // update all package versions and inter-dependencies
  step("\n更新所有包的版本号...");
  await updateVersions(nextVersion);

  // build all packages with types
  step("\n构建所有的包...");
  if (!skipBuild && !isDryRun) {
    await run("pnpm", ["build", "--release"]);
    // test generated dts files
    // step("\n校验生成的typescript类型定义...");
    // await run("pnpm", ["test-dts-only"]);
  } else {
    console.log(`(skipped)`);
  }

  step("\n生成更新日志...");
  // generate changelog
  await run(`pnpm`, ["changelog"]);

  const { stdout } = await run("git", ["diff"], { stdio: "pipe" });
  if (stdout) {
    step("\n提交更改内容...");
    await runIfNotDry("git", ["add", "-A"]);
    await runIfNotDry("git", ["commit", "-m", `release: v${nextVersion}`]);
  } else {
    console.log("No changes to commit.");
  }

  // publish packages
  step("\n发布所有的包...");
  for (const pkg of workspaces) {
    await publishPackage(pkg, nextVersion);
  }

  // push to GitHub
  step("\n同步到代码仓库...");
  await runIfNotDry("git", ["tag", `v${nextVersion}`]);
  await runIfNotDry("git", ["push", "origin", `refs/tags/v${nextVersion}`]);
  await runIfNotDry("git", ["push"]);

  if (isDryRun) {
    console.log(`\n纯执行完成 - 使用git diff命令查看包的变更`);
  }

  if (skippedPackages.length) {
    console.log(
      chalk.yellow(
        `以下这些包为私有包，无需发布:\n- ${skippedPackages.join("\n- ")}`
      )
    );
  }
  console.log();
}

/**
 * 更新所有workspace的版本，包括互相依赖使用的版本号
 * @param {string} nextVersion
 */
async function updateVersions(nextVersion) {
  const workspaces = await getWorkspaces();
  const rootWorkspace = process.cwd();

  await Promise.all(
    [rootWorkspace, ...workspaces].map((workspace) =>
      updatePackage(workspace, nextVersion)
    )
  );
}

/**
 * 更新子包的版本
 * @param {string} pkgRoot
 * @param {string} version
 */
async function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, "package.json");
  const pkg = JSON.parse(await fsp.readFile(pkgPath, "utf-8"));

  pkg.version = version;

  await updateDeps(pkg, "dependencies", version);
  await updateDeps(pkg, "peerDependencies", version);

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function updateDeps(pkg, depType, version) {
  const deps = pkg[depType];

  if (!deps) return;

  await Promise.all(
    Object.keys(deps).map(async (dep) => {
      if (await isWorkspacesPackage(dep)) {
        console.log(
          chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`)
        );
        deps[dep] = version;
      }
    })
  );
}

/**
 * 发布某个包至远程仓库
 * @param {string}} workspace 工作区绝对路径
 * @param {string} version 要发布的版本号
 * @returns
 */
async function publishPackage(workspace, version) {
  const pkgPath = path.resolve(workspace, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  if (pkg.private) {
    skippedPackages.push(pkg.name);
    return;
  }

  step(`发布包: ${pkgName}...`);
  try {
    await runIfNotDry("pnpm", ["publish", "--access", "public"], {
      cwd: workspace,
      stdio: "pipe",
    });
    console.log(chalk.green(`成功发布: ${pkgName}, 版本号: ${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`包${pkgName}发布时发生异常，已跳过该包的发布。`));
    } else {
      throw e;
    }
  }
}

main().catch((err) => {
  console.error(err);
});
