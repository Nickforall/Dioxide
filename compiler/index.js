const parse = require("./Parser");
const tokenizer = require("./TokenStream");
const inputStream = require("./io/InputStream");

function createAST(data, callback) {
    var res = parse(tokenizer(inputStream(data)));
    if(callback) callback(res);
    return res;
}

module.exports.parse = createAST;
