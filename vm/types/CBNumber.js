const CarbonBase = require("./CarbonBase")

class CBNumber extends CarbonBase {
    constructor(jsnum) {
        super("NUMBER");

        this.content = jsnum;
    }

    toJsNumber() {
        return this.content
    }

    toJsString() {
        return "" + this.content;
    }

    toJsVal() {
        return this.content;
    }
}

module.exports = CBNumber;
