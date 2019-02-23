var path = require('path'), webpack = require('webpack'), version = require("./package.json").version;

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  entry: 'vue-pursue.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-pursue.js',
    library: 'VuePursue',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin({banner:
`Vue-Pursue v${version}
https://github.com/mikeapr4/vue-pursue
@license MIT`
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'babel-loader'
    }]
  }
};