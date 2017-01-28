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

    valAdd(value) {
        if(value.getTypename() === "NUMBER") {
            return new CBNumber(value.toJsNumber() + this.content)
        } else {
            super.valAdd(value);
        }
    }
}

module.exports = CBNumber;
