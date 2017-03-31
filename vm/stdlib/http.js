const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");
const CBNull = require("../types/CBNull");


const defaults = {
    method: new CBString("get"),
    headers: {
        "User-Agent": new CBString("Carbon-http")
    }
}

const httplib = new CBFunction(false, function(cb, options) {
    if(options.getTypename() !== "OBJECT") throw new Error("Object expected");
    if(cb.getTypename() !== "FUNCTION") throw new Error("Callback expected");

    var options = Object.assign({}, defaults, options.content);
    console.log(options);

    return new CBNull();
});

module.exports = httplib;
