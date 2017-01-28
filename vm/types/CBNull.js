const CarbonBase = require("./CarbonBase")

class CBNull extends CarbonBase {
    constructor() {
        super("NULL");
    }

    toJsString() {
        return "null"
    }

    toJsBoolean() {
        return false;
    }
}

module.exports = CBNull;
