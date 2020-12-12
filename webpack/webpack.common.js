const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const IgnoreNotFoundExportPlugin = require("./plugins/IgnoreNotFoundExportPlugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const srcFolder = path.resolve(__dirname, "../src");

const env = dotenv.config().parsed;
if (env === undefined) throw new Error("did you forget to add a .env file?");

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".json"],
    // alias: {
    //     'reim-src': srcFolder,
    //     'reim-app': path.resolve(srcFolder, 'components/App'),
    //     'reim-components': path.resolve(srcFolder, 'components'),
    //     'reim-context': path.resolve(srcFolder, 'context'),
    //     'reim-hooks': path.resolve(srcFolder, 'hooks'),
    //     'reim-layout': path.resolve(srcFolder, 'layout'),
    //     'reim-pages': path.resolve(srcFolder, 'pages'),
    //     'reim-util': path.resolve(srcFolder, 'util'),
    // },
  },
  stats: {
    env: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              plugins: ["react-hot-loader/babel"],
            },
          },
          {
            loader: "eslint-loader",
            options: {
              formatter: "stylish",
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "eslint-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "../www", "index.html"),
      favicon: path.resolve(__dirname, "../www", "favicon.ico"),
      filename: "./index.html",
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "../www", "index.html"),
    //       to: "[path][name].[ext]",
    //     },
    //   ],
    // }),
    new webpack.DefinePlugin(envKeys),
    new IgnoreNotFoundExportPlugin(),
  ],
};
