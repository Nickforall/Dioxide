const CarbonBase = require("./CarbonBase");

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

    toArgsObject(argvals) {
        let obj = {};

        for (var i = 0; i < this.args.length; i++) {
            obj[this.args[i]] = argvals[i];
        }

        return obj;
    }
}

module.exports = CBFunction;
