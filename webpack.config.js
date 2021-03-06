const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputDirectory = 'dist';

module.exports = [
  {
    entry: ['@babel/polyfill', './src/client/app-client.js'],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js',
      publicPath: '/',
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
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      port: 3000,
      open: true,
      proxy: {
        '/api': 'http://localhost:8080',
        '/auth': 'http://localhost:8080',
      },
      historyApiFallback: true,
    },
    plugins: [
      new CleanWebpackPlugin([outputDirectory]),
      new HtmlWebpackPlugin({
        template: './templates/index.ejs',
        historyApiFallback: true,
      }),
      new CopyWebpackPlugin([
        {
          from: 'public',
          to: './',
        },
      ]),
    ],
  },
  {
    target: 'node',
    node: {
      __dirname: false,
    },
    externals: [/^(?!\.|\/).+/i],
    entry: {
      js: './src/server/server.js',
    },
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'server-es5.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: path.join(__dirname, 'src'),
          use: {
            loader: 'babel-loader',
            options: 'cacheDirectory=.babel_cache',
          },
        },
      ],
    },
  },
];
