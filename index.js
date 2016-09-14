/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Sebastien Dubois @dSebastien
*/
"use strict";

module.exports = function(source) {
	this.cacheable && this.cacheable(); // the result of this loader can be cached
    
    if(!typeof source === "string") {
        throw new Error("The input given to the json-merge-loader must be a string!");
    }
    
    let sourceAsJSON = {};
    
    try {
        sourceAsJSON = JSON.parse(source);
    } catch (e) {
        throw new Error("The file given to the json-merge-loader couldn't be parsed as a JSON object; it is probably not well formed!");
    }
    
    if(typeof sourceAsJSON !== 'object') {
        throw new Error("The file given to the json-merge-loader is not a JSON file. The json-merge-loader requires a json configuration file!");
    }
    
    if(!sourceAsJSON.hasOwnProperty("files")) {
        throw new Error("The file given to the json-merge-loader must have a files property!");
    }

    if(sourceAsJSON.files.constructor !== Array) {
        console.log("duh");
        throw new Error("The files property in the file given to the json-merge-loader must be an array!");
    }
    
    if(sourceAsJSON.files.length === 0) {
        throw new Error("The files property in the file given to the json-merge-loader must contain at least one entry!");
    }
    
    // will hold the result of this loader
    let mergedContents = {};
    
    for(let entry of sourceAsJSON.files) {
        if(typeof entry !== "string") {
            throw new Error("Entries in the files property of the file given to the json-merge-loader must be string objects");
        }
        
        // TODO check if the entry path exists
        // TODO try to load the files
        // TODO try to parse the files
        // TODO merge the contents
    }
    
    // TODO return a module: 
    // this.value = [value];
    //return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
    return source;
};
