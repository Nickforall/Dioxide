const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");

const proc = {
    pid: new CBNumber(process.pid),
    uptime: new CBFunction(false, function() {
        return new CBNumber(process.uptime());
    }),
    cwd: new CBString(process.cwd()),
    exit: new CBFunction(false, function(_code) {
        let code = 0;
        if(_code.typename !== "NULL") {
            if(_code.getTypename() !== "NUMBER") throw new Error("Number expected");
            code = _code.toJsNumber();
        }

        process.exit(code);
    })
}

module.exports =  new CBObject(proc);
