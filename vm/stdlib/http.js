const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");
const CBNull = require("../types/CBNull");
const request = require('request');

function buildCarbonResponse(res) {
    var out = {};

    out.statusCode = new CBNumber(res.statusCode);
    out.body = new CBString(res.body);
    out.version = new CBString(res.httpVersion);

    out.headers = {};

    for (var header in res.headers) {
        if (res.headers.hasOwnProperty(header)) {
            out.headers[header] = new CBString(res.headers[header]);
        }
    }

    return new CBObject(out);
}


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

    let vmvars = this.CARBONVM;

    request(out, function(error, response) {
        if(error) throw new Error("Something went wrong with your http request");

        let cbResObject = buildCarbonResponse(response);

        cb.execute(
            vmvars.image,
            [cbResObject],
            vmvars.parentid,
            vmvars.scopemanager,
            vmvars.cpu
        );
    });

    return new CBNull();
});

module.exports = httplib;
