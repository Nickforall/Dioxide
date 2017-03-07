const CarbonBase = require("./CarbonBase");
const CBNull = require("./CBNull");

class CBObject extends CarbonBase {
    constructor(obj) {
        super("OBJECT");

        this.content = obj
    }

    getProperty(prop) {
        return this.content[prop] ? this.content[prop] : new CBNull();
    }

    setProperty(prop, value) {
        if(value.typename == "NULL") {
            this.content[prop] = undefined;
        } else {
            if(!value._iscarbon) throw new Error("Prop");
            this.content[prop] = value;
        }
    }
}

module.exports = CBObject;
