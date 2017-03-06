const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");

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
    })
};

module.exports = functions;
