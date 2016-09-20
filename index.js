/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Sebastien Dubois @dSebastien
 */
"use strict";

const path = require("path");
const fs = require("fs");
const loaderUtils = require("loader-utils");
const merge = require("merge");

// Helper functions
const _root = path.resolve(__dirname, "./"); // project root folder

function hasProcessFlag(flag){
    return process.argv.join("").indexOf(flag) > -1;
}

function root(args){
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [ _root ].concat(args));
}

function loadEntriesData(files, debug){
    let entriesData = [];

    if(debug === true) {
        console.log("json-files-merge-loader: loading entries data for "+files);
    }
    
    for(let entry of files){
        if(debug === true) {
            console.log("json-files-merge-loader: loading entry data for "+entry);
        }
        
        if(typeof entry !== "string"){
            throw new Error("Entries in the files array of the file given to the json-files-merge-loader must be string objects!");
        }

        entry = entry.trim();

        if(entry.length === 0){
            throw new Error("Entries in the files array of the file given to the json-files-merge-loader cannot be empty!");
        }

        if(entry.startsWith("/")){
            throw new Error("Entries in the files array of the file given to the json-files-merge-loader must define a relative path!");
        }

        if(!entry.endsWith(".json") && !entry.endsWith(".JSON")){
            throw new Error("Entries in the files array of the file given to the json-files-merge-loader must be json files (file extension check)");
        }

        let entryPath = root(entry);

        let entryData = undefined;

        try{
            entryData = fs.readFileSync(entryPath, 'utf8');
            if(debug === true) {
                console.log("json-files-merge-loader: loaded entry data: "+entryData);
            }
        } catch(e){
            console.error("One of the entries in the files array given to the json-files-merge-loader is not accessible (does not exist, unreadable, ...): " + entryPath);
            throw e;
        }

        if(!entryData){
            throw new Error("One of the entries in the files array given to the json-files-merge-loader could not be read: " + entryPath);
        }

        // try to get a JSON object from the file data
        let entryDataAsJSON = {};

        try{
            entryDataAsJSON = JSON.parse(entryData);
        } catch(e){
            console.error("One of the entries in the files array given to the json-files-merge-loader could not be parsed as a JSON object; it is probably not well formed! File in error: " + entryPath);
            throw e;
        }

        if(typeof entryDataAsJSON !== 'object'){
            throw new Error("One of the entries in the files array given to the json-files-merge-loader is not a JSON file. The json-files-merge-loader can only merge JSON files! File in error: " + entryPath);
        }

        if(debug === true) {
            console.log("json-files-merge-loader: entry data successfully parsed as a JSON object");
        }

        // let's put the data aside for now
        entriesData.push(entryDataAsJSON);
    }
    return entriesData;
}

module.exports = function (source) {
    let debug = false;
    if(this.debug && this.debug === true){
        debug = true;
    }

    const config = loaderUtils.getLoaderConfig(this, "jsonMergeLoader");
    if(config.debug === true) {
        debug = true;
    }else if(config.debug === false) {
        debug = false;
    }

    if(debug === true) {
        console.log("json-files-merge-loader: debug enabled");
    }
    
    // Load the json-files-merge-loader configuration
    this.cacheable && this.cacheable(); // the result of this loader can be cached

    if(typeof source !== "string"){
        throw new Error("The input given to the json-files-merge-loader must be a string!");
    }

    if(debug === true) {
        console.log("json-files-merge-loader: configuration contents: ",source);
    }

    let sourceAsJSON = {};

    try{
        sourceAsJSON = JSON.parse(source);
    } catch(e){
        console.error("The file given to the json-files-merge-loader couldn't be parsed as a JSON object; it is probably not well formed!");
        throw e;
    }

    if(typeof sourceAsJSON !== 'object'){
        throw new Error("The file given to the json-files-merge-loader is not a JSON file. The json-files-merge-loader requires a json configuration file!");
    }

    if(debug === true) {
        console.log("json-files-merge-loader: successfully parsed the configuration file as a JSON object");
    }

    if(!sourceAsJSON.hasOwnProperty("files")){
        throw new Error("The file given to the json-files-merge-loader must have a files property!");
    }

    if(debug === true) {
        console.log("json-files-merge-loader: the configuration file contains the 'files' key as required");
    }

    if(sourceAsJSON.files.constructor !== Array){
        throw new Error("The files property in the file given to the json-files-merge-loader must be an array!");
    }

    if(debug === true) {
        console.log("json-files-merge-loader: the 'files' key is an array as required");
    }

    if(sourceAsJSON.files.length === 0){
        throw new Error("The files property in the file given to the json-files-merge-loader must contain at least one entry!");
    }

    // will hold the data of all entries we load
    let entriesData = loadEntriesData(sourceAsJSON.files, debug);

    // will hold the result of this loader
    let mergedContents = {};

    for(let entryData of entriesData){

        if(debug === true) {
            console.log("json-files-merge-loader: about to merge ("+JSON.stringify(mergedContents)+") with ("+JSON.stringify(entryData)+")");
        }
        
        mergedContents = merge(mergedContents, entryData);
        if(debug === true) {
            console.log("json-files-merge-loader: merge result: "+JSON.stringify(mergedContents));
        }
    }

    if(debug === true) {
        console.log("json-files-merge-loader: finished merging all files. End result: " + mergedContents);
        console.log("json-files-merge-loader: wrapping the merged contents in a cjs module");
    }
    
    // wrap the merged contents in an array
    mergedContents = [mergedContents];
    
    // define the module export containing the merged contents
    let retVal = "module.exports = " + JSON.stringify(mergedContents, undefined, "\t") + ";";

    if(debug === true) {
        console.log("json-files-merge-loader: finished wrapping the merged contents in a cjs module: "+retVal);
    }
    
    return retVal;
};
