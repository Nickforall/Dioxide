const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");

const functions = {
    print: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString());
    }),
    println: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString() + "\r\n")
    }),
    __executepath: new CBString(process.cwd())
};

module.exports = functions;
