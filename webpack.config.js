var webpack = require("webpack");
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require("path");
var distPath = path.join(__dirname, "dist");

const config = {
  entry: {
    "redux-automata": ["./src/index.ts"]
  },
  output: {
    path: distPath,
    filename: "redux-automata.js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [{
      test: /\.(ts|tsx)?$/,
      loader: "ts-loader",
      options: {
        configFile: "tsconfig.json"
      },
      exclude: [/node_modules/]
      
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};

module.exports = [ config,
{
  ...config,   
  module: {
    rules: [{
      test: /\.(ts|tsx)?$/,
      loader: "ts-loader",
      options: {
        configFile: "tsconfig.module.json"
      },
      exclude: [/node_modules/]
    }]
  }, 
}]