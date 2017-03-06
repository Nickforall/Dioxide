const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");

const functions = {
    print: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString());
    }),
    println: new CBFunction(false, function(cbObject) {
        process.stdout.write(cbObject.toJsString() + "\r\n")
    }),
    __executepath: new CBString(process.cwd()),
    asyncprinttest: new CBFunction(false, function(cbFunction) {
        let vmvars = this.CARBONVM;

        if(cbFunction.getTypename() !== "FUNCTION") throw new Error("Callback expected");

        setInterval(function () {
            cbFunction.execute(
                vmvars.image,
                [new CBString("lol")],
                vmvars.parentid,
                vmvars.scopemanager,
                vmvars.cpu
            );
        }, 1000);
    }),
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
    })
};

module.exports = functions;
