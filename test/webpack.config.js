"use strict";

// Webpack config
module.exports = {
    debug: true,
    entry: {
        "main": "./example.js",
    },
    output: {
        path: "../.tmp",
        filename: "[name].bundle.js",
    },
    module: {
        loaders: [
            // Support for *.json files
            {
                test: /\.json-merge$/,
                loaders: [
                    "raw-loader",
                    "json-merge-loader",
                ]
            }
        ],
    },
};

// for test harness purposes only, you would not need this in a normal project
module.exports.resolveLoader = { 
    alias: { 
        "json-merge-loader": require('path').join(__dirname, "../index.js")
    }
};
