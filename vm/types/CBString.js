const CarbonBase = require("./CarbonBase")

class CBString extends CarbonBase {
    constructor(jsstring) {
        super("STRING");

        this.content = jsstring;
    }

    toJsString() {
        return this.content;
    }
}

module.exports = CBString;
