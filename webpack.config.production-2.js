const path = require( 'path' );
const webpack = require( 'webpack' );


module.exports = {
  context: path.resolve( __dirname, './client' ),
  entry: path.resolve( __dirname, './client/views/Root.jsx' ),
  output: {
    path: path.resolve( __dirname, './build' ),
    filename: 'js/bundle.min.js',
  },
  devServer: {
    contentBase: path.resolve( __dirname, './build' ),
    inline: true,
    port: 4000,
    historyApiFallback: true,
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node-modules/,
        use: 'babel-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify( 'production' ),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true,
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
      output: {
        comments: false,
      },
    }),
  ],
  resolve: {
    alias: {
      views: path.resolve( __dirname, './client/views' ),
      config: path.resolve( __dirname, './client/config' ),
      styles: path.resolve( __dirname, './client/styles' ),
      utils: path.resolve( __dirname, './client/utils' ),
      constants: path.resolve( __dirname, './client/constants' ),
      reducers: path.resolve( __dirname, './client/reducers' )
    },
    extensions: ['.js', '.jsx'],
  }
};
