/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    server: './src/server/index.ts'
  },
  mode: 'none',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
        exclude: [/node_modules/],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      }
    ],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: './[name].css',
      chunkFilename: './[id].css',
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
