#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const path = require("path");
const fs = require("fs");

const optionDefinitions = [
  { name: 'f', type: String, defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

if(!options.f) {
    throw new Error("No Input File Specified!");
}

const filepath = path.join(process.cwd(), options.f);
const filecontents = fs.readFileSync(filepath, 'utf8');

const parser = require("./compiler/index");
const compiler = require("./compiler/bytecode/compiler")

const VM = require("./vm/VM");

parser.parse(filecontents, (tree) => {
    compiler.compileTree(tree, (image) => {
        VM(image.serialize());
    });
});
