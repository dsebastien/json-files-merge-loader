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

Each file listed in the "files" array must be a JSON file.

## Installation

`npm install --save json-merge-loader`

## Usage

``` javascript
let mergedConfiguration = require("json-merge!json!./config-root.json");
// => returns a JSON object representing the merge of all the entries in the "file" array defined within config-root.json
```

Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
