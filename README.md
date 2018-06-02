# json-files-merge loader for webpack

[![Greenkeeper badge](https://badges.greenkeeper.io/dsebastien/json-files-merge-loader.svg)](https://greenkeeper.io/)

## About
This plugin provides a way to merge multiple configuration files and retrieve the result as a JSON object. The JSON files are merged using https://www.npmjs.com/package/merge


This loader expects to receive a configuration JSON object with the following format:

```
{
    "files": [
        // path to all files to load/merge together
    ]
}
```

Each file listed in the `files` array must be a JSON file.
The path for each file must be a relative path starting from the root of your application module (e.g., src/filesToMerge/file1.json)

## Installation

`npm install --save json-merge-loader`

## Usage

``` javascript
let mergedConfiguration = require("./config-root.json-merge");
// => returns a module representing the merge of all the entries in the "file" array defined within config-root.json
```

The above will work assuming that you have configured the loaders for all json-merge files as follows:
```
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
```

Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

## Configuration
You can configure the JSON Merge Loader in your webpack configuration:

```
"use strict";

// Webpack config
module.exports = {
    ...

    // (optional) configuration of the JSON Merge Loader
    jsonMergeLoader: {
        debug: true,
        ...
    },
};

```

Supported options:
* debug (true|false): verbose output
* TIP: by default, the "debug" property of the Webpack configuration is used, but you can override the value for this loader

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
