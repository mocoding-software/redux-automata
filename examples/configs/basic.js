const webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackTemplate = require('html-webpack-template');
const path = require("path");

console.log(__dirname);

module.exports = {
    entry: [              
        "./basic/index.tsx",
    ],
    output: {
        path: "/",
        filename: "app.js",
        publicPath: "/",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "eval",
    mode: "development",

    resolve: {
        alias: {
            "redux-automata": path.join(__dirname, "../../src"),
        },
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a ".ts" or ".tsx" extension will be handled by "ts-loader".
            {
                test: /\.tsx?$/,
                loaders: "ts-loader",
                exclude: [/node_modules/]
            }
        ]
    },


    plugins: [       
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            template: HtmlWebpackTemplate,
            appMountId: 'app',
            mobile: true,
            links: ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"]
        })
    ]
};