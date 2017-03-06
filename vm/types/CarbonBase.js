const CBString = require('./CBString');

class CarbonBase {
    constructor(typename) {
        this.typename = typename;
        this._iscarbon = true;
    }

    getTypename() {
        return this.typename;
    }

    toJsBoolean() {
        return true;
    }

    toJsString() {
        return "(Unknown Object)";
    }
}

module.exports = CarbonBase;
