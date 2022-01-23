const path = require('path');
const RefreshWebpack = require('@pmmmwh/react-refresh-webpack-plugin');


module.exports = {
  name : 'lotto',
  mode : 'development',
  devtool : 'eval',
  resolve : {
    extensions : ['.js', '.jsx'],
  },

  entry : {
    app : ['./client'],
  },

  module : {
    rules : [{
      test : /\.jsx?$/,
      loader : 'babel-loader',
      options : {
        presets : [
          '@babel/preset-env', '@babel/preset-react',
        ],
        plugins : [
          'react-refresh-babel',
        ],
      },
    }],

    plugins : [
      new RefreshWebpack(),
    ],

    output : {
      path : path.join(__dirname, 'reasult'),
      filename : 'app.js',
      publicPath : '/result/',
    },

    devServer : {
      devMiddleware : {publicPath : '/result/'},
      static : {diretory : path.resolve(__dirname)},
      hot :true,
    },
  },
}