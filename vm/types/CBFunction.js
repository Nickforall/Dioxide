const CarbonBase = require("./CarbonBase");
const CBNull = require("./CBNull");

const VM = require("../VM");

class CBFunction extends CarbonBase {
    constructor(native, codeblock, arglist) {
        super("FUNCTION");

        this.args = arglist;
        this.native = native;
        this.content = codeblock;
    }

    toJsString() {
        return "FUNCTION"
    }

    getCodeBlock() {
        return this.content;
    }

    isNative() {
        return this.native;
    }

    apply(args) {
        if(!this.native) {
            this.content.apply({}, args);
        } else {
            throw new Error("The VM tried executing a native function as non-native");
        }
    }

    toJsBoolean() {
        return false;
    }

    execute(image, args, parentid, scopemanager, cpu) {
        let scope = scopemanager.createScope(parentid);
        //feed our args in the function
        scopemanager.getScope(scope)
                    .feed(this.toArgsObject(args));

        //execute its instructions
        cpu(this.getCodeBlock().block, scope, image);
    }

    toArgsObject(argvals) {
        let obj = {};

        //Make sure args are in the right order (Dioxide#6)
        while (this.args.length != argvals.length) {
            argvals.unshift(new CBNull());
        }

        for (var i = 0; i < this.args.length; i++) {
            obj[this.args[i]] = argvals[i];
        }

        return obj;
    }
}

module.exports = CBFunction;
