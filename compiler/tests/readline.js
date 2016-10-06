const readline = require('readline');
const colors = require('colors');
const compiler = require('../index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Carbonscript v2")
process.stdout.write("> ");

rl.on('line', (input) => {
    try {
        compiler.parse(input, (result) => {
            console.log(JSON.stringify(result, null, 2));
            process.stdout.write("> ");
        });
    } catch(error) {
        console.log(colors.red(error.message));
        console.log(error.stack);
        process.stdout.write("> ");
    }
});
