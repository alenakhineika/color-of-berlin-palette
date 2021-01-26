/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/client/index.tsx',
  },
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
  plugins: [new MiniCssExtractPlugin({
    filename: './[name].css',
    chunkFilename: './[id].css',
  })],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less'],
  },
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, 'dist/public'),
  },
};
