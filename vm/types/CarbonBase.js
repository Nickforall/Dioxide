const CBString = require('./CBString');
//const CBBool = require('./CBBool');

class CarbonBase {
    constructor(typename) {
        this.typename = typename;
        this._iscarbon = true;
    }

    getTypename() {
        return this.typename;
    }

    toCbBoolean() {
        //return new CBBool(this.toJsBoolean())
    }

    toJsBoolean() {
        return true;
    }

    toCbString() {
        //return new CBString(this.toJsString());
    }

    toJsString() {
        return "(Unknown Object)";
    }

    valAdd(value) {
        //return new CBString(this.toJsString() + value.toJsString());
    }
}

module.exports = CarbonBase;
