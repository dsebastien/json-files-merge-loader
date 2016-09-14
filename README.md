# json-merge loader for webpack

## About
This plugin provides a way to merge multiple configuration files and retrieve the result as a JSON object.
This loader expects to receive a configuration JSON object with the following format:

```
{
    "files": [
        // path to all files to load/merge together
    ]
}
```

Each file listed in the `files` array must be a JSON file.

## Installation

`npm install --save json-merge-loader`

## Usage

``` javascript
let mergedConfiguration = require("./config-root.json-merge");
// => returns a JSON object representing the merge of all the entries in the "file" array defined within config-root.json
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

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
