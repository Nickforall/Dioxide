console.log("Hello and, again, welcome to the Carbonscript computer-aided enrichment center.");
console.log("We hope your brief detention in the relaxation vault has been a pleasant one.");

console.log("We will start testing soon.");

const config = require("./full/config.json");
const compiler = require("../index.js");
const fs = require("fs");
const path = require("path");

const color = require("colors");

const showAST = false;

console.log("Loading a grand total of " + config.files.length + " tests.");

var success = 0;

for (var i = 0; i < config.files.length; i++) {
    try {
        compiler.parse(fs.readFileSync(path.join(__dirname, 'full', config.files[i]), 'utf8'), (res) => {
            success++;
            if(showAST) console.log(JSON.stringify(res, null, 2));
            console.log("[ " + color.green("OK") + " ] parsed " + config.files[i]);
        });
    } catch(err) {
        console.log("[ " + color.red("ERR") + " ] "  + "(" + config.files[i] + ") " + err.message);
    }
}

console.log("Finished doing tests");
console.log("The results are in, " + color.green("" + success) + " succeeded, and "
    + color.red("" + ((config.files.length) - success)) + " failed.");
