const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");
const CBNull = require("../types/CBNull");


const defaults = {
    method: new CBString("GET"),
    headers: {
        "User-Agent": new CBString("Carbon-http")
    }
}

const httplib = new CBFunction(false, function(cb, options) {
    if(options.getTypename() !== "OBJECT") throw new Error("Object expected");
    if(cb.getTypename() !== "FUNCTION") throw new Error("Callback expected");

    var headers = {};
    if(options.content.headers.content) headers = Object.assign({}, defaults.headers, options.content.headers.content);

    var opt = Object.assign({}, defaults, options.content);
    opt.headers = headers;

    if(!opt.url) throw new Error("Url is a required option");

    var headersOut = {};

    for (var key in opt.headers) {
        if (opt.headers.hasOwnProperty(key)) {
            headersOut[key] = opt.headers[key].toJsString();
        }
    }

    var out = {}
    delete opt.headers;

    for (var key in opt) {
        if (opt.hasOwnProperty(key)) {
            if(!opt[key]._iscarbon) continue;

            out[key] = opt[key].toJsVal();
        }
    }

    out.headers = headersOut;

    console.log(out)

    return new CBNull();
});

module.exports = httplib;
