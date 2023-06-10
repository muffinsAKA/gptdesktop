const path = require('path');

module.exports = {
  mode: 'production',
  entry: './renderer.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false, // Set 'fs' to 'false' to avoid attempting to resolve it
      path: require.resolve('path-browserify'), // Use 'path-browserify' as a polyfill for 'path'
    },
  },
};
