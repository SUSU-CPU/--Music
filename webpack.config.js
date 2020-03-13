let path = require('path')

// 导入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//导入处理html插件
const HTML_WEBPACK_PLUGIN = require('html-webpack-plugin');

// 导入压缩css插件
const Optimize_CssAssets_Webpack_Plugin = require('optimize-css-assets-webpack-plugin');

let OptimizeCssAssetsWebpackPlugin = new Optimize_CssAssets_Webpack_Plugin({})

let miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css'
})

let htmlWebpackPlugin = new HTML_WEBPACK_PLUGIN({
  template: './index.html',

  inject: true,
  minify: {
    //去除注释
    removeComments: true,

    //移除标签属性的引号
    removeAttributeQuotes: true,

    //去除空白符
    collapseWhitespace: true
  },
  filename: 'index.html'
})

module.exports = {

  mode: "production",

  entry: {
    mus: './JS/music.js',
    inx: './JS/index.js',

  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },

  module: {
    rules: [
      // css-loader
      {
        test: /\.css$/,
        use: [
          // {loader: 'style-loader'},
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]

      },
      // less-loader
      {
        test: /\.less$/,
        use: [
          // {loader:'style-loader'},
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      // url-loader
      {
        test: /\.(png|gif|jpg|jpeg|webp)$/,
        use: [{
          loader: 'url-loader',

          options: {
            limit: 10240,
            esModule: false
          }
        }]
      },
      // html-withimg-loader
      {
        test: /\.html?$/,
        use: [{
          loader: 'html-withimg-loader'
        }]
      }
    ]
  },

  // 插件
  plugins: [
    miniCssExtractPlugin,
    //处理html模板
    htmlWebpackPlugin,
    OptimizeCssAssetsWebpackPlugin
  ],

  devServer: {
    host: 'localhost',
    port: 9001,
    // before(app){
    //   app.get('/',(req,res)=>{
    //     res.send('success')
    //   })
    // }
  }



}