const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;

const baseConfig = require("./webpack.common.js");

module.exports = merge(baseConfig, {
  mode: "production",
  entry: {
    production: path.resolve(__dirname, "../src"),
  },
  output: {
    path: path.resolve(__dirname, "../server/www"),
    filename: "[name].bundle.js",
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/css/",
            },
          },
          "css-loader",
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // Extract imported CSS into own file
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
      chunkFilename: "[id].bundle.css",
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
});
