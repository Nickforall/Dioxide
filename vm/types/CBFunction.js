const CarbonBase = require("./CarbonBase");

class CBFunction extends CarbonBase {
    constructor(native, codeblock) {
        super("FUNCTION");

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
}

module.exports = CBFunction;
