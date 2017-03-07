const debug = require('debug')('vm-types');
const CBString = require('./CBString');

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
}

module.exports = CarbonBase;
