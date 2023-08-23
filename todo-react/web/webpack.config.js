const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MonacoWebpackPlugin()
  ],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
    },
    extensions: ['.jsx', '.js', '.scss', '.json', '.ts', '.tsx'],
  },
};
