var path = require('path');
module.exports = {
  entry: {
    index: './demo/index.js',
    circle: './demo/circle.js'
  },
  output: {
    path: './demo',
    filename: '[name].bundle.js'
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
