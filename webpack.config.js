const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { getBuildOptions } = require("./scripts/utils/build");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const babelConfig = require("./babel.config");
const TypescriptDeclarationPlugin = require("typescript-declaration-webpack-plugin");

// 当前要打包的workspace的绝对路径
const ABSOLUTE_PACKAGE_PATH = process.env.TARGET_PACKAGE;

module.exports = new Promise(async (resolve) => {
  const config = await getBuildOptions(ABSOLUTE_PACKAGE_PATH);

  resolve({
    mode: "production",
    stats: "errors-only",
    entry: path.join(ABSOLUTE_PACKAGE_PATH, "src/index.ts"),
    output: {
      path: path.join(ABSOLUTE_PACKAGE_PATH, "dist"),
      filename: "bundle.umd.js",
      library: {
        name: config.name,
        type: "umd",
      },
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: babelConfig,
            },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: babelConfig,
            },
            "ts-loader",
          ],
        },
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          use: ["vue-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.bpmn$/,
          use: ["raw-loader"],
        },
        {
          test: /\.bpmn$/,
          use: ["raw-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|svg|gif)$/,
          use: ["url-loader"],
        },
        {
          test: /\.(eot|ttf|woff|woff2)/,
          use: ["url-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new TypescriptDeclarationPlugin({
        out: "bundle.d.ts",
        removeComments: false,
      }),
      new VueLoaderPlugin(),
    ],
    resolve: {
      extensions: [".js", ".json", ".vue", ".ts"],
    },
    externals: ["vue", "element-ui", /^@xjj-npapi/],
    optimization: {
      minimize: true,
    },
  });
});
