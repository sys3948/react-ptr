// 이 webpack.config에서 webpack이 돌아간다. 

const path = require('path');

module.exports = {
  name : 'wordrelay-setting', // 개발자가 맘대로 지정한다.
  mode : 'development', // 실서비스 : production
  devtool : 'eval', // 빠르게 한다는 설정
  resolve : { // entry에서의 확장자를 생략할 수 있게 해주는 설정.
    extensions : ['.js', '.jsx'],
  },

  entry : { // 입력
    app : ['./client'],
  },
  
  module : {
    rules : [{
      test : /\.jsx?$/, // 정규표현식으로 js, jsx에 rule을 적용하겠다.
      loader : 'babel-loader',
      options : {
        presets : ['@babel/preset-env', '@babel/preset-react'],
      },
    }],
  },

//   module: {
//     rules: [{
//       test: /\.jsx?$/,
//       loader: 'babel-loader',
//       options: {
//         presets: [
//           '@babel/preset-env',
//           '@babel/preset-react',
//         ],
//       },
//     }],
//   },

  output : { // 출력
    path : path.join(__dirname, 'result'), // path는 현재 폴더에서 result 폴더를 의미한다.
    filename : 'app.js',
  },
}