const CBFunction = require("../types/CBFunction");

const functions = {
    print: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString());
    }),
    println: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString() + "\r\n")
    })
};

module.exports = functions;
