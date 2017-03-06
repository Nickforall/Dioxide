const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");

const functions = {
    print: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString());
    }),
    println: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString() + "\r\n")
    }),
    __testobj: new CBObject({
        str: new CBString("Helloa")
    }),
    __executepath: new CBString(process.cwd()),
    sleep: new CBFunction(false, function(time, cbFunction) {
        let vmvars = this.CARBONVM;

        if(cbFunction.getTypename() !== "FUNCTION") throw new Error("Callback expected");
        if(time.getTypename() !== "NUMBER") throw new Error("Number expected");

        setTimeout(function () {
            cbFunction.execute(
                vmvars.image,
                [],
                vmvars.parentid,
                vmvars.scopemanager,
                vmvars.cpu
            );
        }, time.toJsNumber());
    }),
    unixtime: new CBFunction(false, function() {
        return new CBNumber(Math.floor(Date.now() / 1000));
    }),
    unixtimemillis: new CBFunction(false, function() {
        return new CBNumber(Date.now());
    }),
    PI: new CBNumber(Math.PI),
    E: new CBNumber(Math.E),
    __simplefor: new CBFunction(false, function(cbFunction, loops) {
        let vmvars = this.CARBONVM;

        if(cbFunction.getTypename() !== "FUNCTION") throw new Error("Callback expected");
        if(loops.getTypename() !== "NUMBER") throw new Error("Number expected");

        for (var i = 1; i <= loops.toJsNumber(); i++){
            cbFunction.execute(
                vmvars.image,
                [loops, new CBNumber(i)],
                vmvars.parentid,
                vmvars.scopemanager,
                vmvars.cpu
            );
        }
    })
};

module.exports = functions;
