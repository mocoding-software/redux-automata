var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require("path");
var distPath = path.join(__dirname, "dist");

module.exports = {
  entry: {
    "lib": ["./src/index.ts"]
  },
  output: {
    path: distPath,
    filename: "redux-automata.min.js",
    library: "redux-automata",
    libraryTarget: "umd"    
  },
  resolve: {
	  extensions: [".ts", ".js"]
  },

  module: {
    loaders: [{
      test: /\.(ts|tsx)?$/,
      loaders: ["ts-loader"],
      exclude: [/node_modules/]
	}]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin([distPath]),
    new webpack.optimize.DedupePlugin(),        
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()    
  ]
};