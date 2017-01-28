const fs = require("fs");
const path = require("path");
const colors = require("colors")


const file = fs.readFileSync(path.join(__dirname, "testcase.cb"), 'utf8');

const compiler = require('../../index');
const bytecode = require('../compiler');

console.log("Compiling testcase.cb".green);

compiler.parse(file, (result) => {
    console.log(require('util').inspect(bytecode.compileTree(result).serialize(), { depth: null }).gray);
});
