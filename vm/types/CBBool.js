const CarbonBase = require("./CarbonBase")
const CBString = require('./CBString');

class CBBool extends CarbonBase {
    constructor(jsbool) {
        super("BOOLEAN");

        this.content = jsbool;
    }

    toJsString() {
        return this.content ? "true" : "false"
    }

    toCbBoolean() {
        return this;
    }

    toJsBoolean() {
        return this.content;
    }
}

module.exports = CBBool;
