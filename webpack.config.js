var path = require('path');
module.exports = {
  entry: './demo/index.js',
  output: {
    path: './demo',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};