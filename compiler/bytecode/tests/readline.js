const readline = require('readline');
const colors = require('colors');
const compiler = require('../../index');
const bytecode = require('../compiler');
const compilerInfo = require("../../../compilerinfo.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(("Carbonscript v" + compilerInfo.version.join(".") + " (" + compilerInfo.version_name + ")").inverse);
process.stdout.write("> ".green);

rl.on('line', (input) => {
    try {
        compiler.parse(input, (result) => {
            console.log(require('util').inspect(bytecode.compileTree(result).serialize(), { depth: null }).gray);
            process.stdout.write("> ".green);
        });
    } catch(error) {
        console.log(colors.red(error.message));
        console.log(error.stack);
        process.stdout.write("> ".green);
    }
});
