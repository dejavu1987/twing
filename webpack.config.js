const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

console.log(path.resolve(__dirname, 'public/dist'));

module.exports = {
  entry: {
    app: './public/javascripts/index.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [new CleanWebpackPlugin()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  devServer: {
    contentBase: './public',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        minify(file, sourceMap) {
          const extractedComments = [];

          // Custom logic for extract comments

          const { error, map, code, warnings } = require('uglify-module') // Or require('./path/to/uglify-module')
            .minify(file, {
              /* Your options for minification */
            });

          return { error, map, code, warnings, extractedComments };
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
