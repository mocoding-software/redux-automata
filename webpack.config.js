var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require("path");
var distPath = path.join(__dirname, "dist");

module.exports = {
  entry: {
    "redux-automata": ["./src/index.ts"]
  },
  output: {
    path: distPath,
    filename: "[name].min.js",
    library: "[name]",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [{
      test: /\.(ts|tsx)?$/,
      use: "ts-loader",
      exclude: [/node_modules/]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin([distPath]),        
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};