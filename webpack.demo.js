var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // entry: './src/main.js',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/spread-js-table/dist/',
    filename: 'spread-js-table-demo.js',
    libraryExport: 'default',
    library: 'spread-js-table', // 指定的就是你使用require时的模块名
    libraryTarget: 'umd',// 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules')
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  externals: {
    '@grapecity/spread-sheets': {
      root: 'GC',
      commonjs: '@grapecity/spread-sheets',
      commonjs2: '@grapecity/spread-sheets',
      amd: '@grapecity/spread-sheets'
    },
    '@grapecity/spread-sheets-vue': '@grapecity/spread-sheets-vue',
    '@grapecity/spread-sheets-charts': '@grapecity/spread-sheets-charts',
    '@grapecity/spread-sheets-resources-zh': '@grapecity/spread-sheets-resources-zh',
    '@grapecity/spread-excelio': '@grapecity/spread-excelio',
    'file-saver': 'file-saver',
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  stats: { children: false },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({   //将打包出来的文件放入src/index.html文件中
      template:'./public/index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
