const debug = require('debug')('vm-types');
const CBString = require('./CBString');
const CBType = require('./CBType');

class CarbonBase {
    constructor(typename) {
        debug("Creating new Carbon Object with typename: " + typename)

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

    toCbType() {
        switch (this.typename) {
            case "NUMBER":
                return new CBType(0);
            case "STRING":
                return new CBType(1);
            case "BOOLEAN":
                return new CBType(2);
            case "ARRAY":
                return new CBType(3);
            case "OBJECT":
                return new CBType(4);
            case "FUNCTION":
                return new CBType(5);

            default:
                throw new Error("This CarbonBase is typeless? (" + typename + ")")
        }
    }
}

module.exports = CarbonBase;
