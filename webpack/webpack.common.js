const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const IgnoreNotFoundExportPlugin = require("./plugins/IgnoreNotFoundExportPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".json"],
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
    new webpack.DefinePlugin(envKeys),
    new IgnoreNotFoundExportPlugin(),
  ],
};
