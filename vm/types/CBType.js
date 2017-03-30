const CarbonBase = require('./CarbonBase');
const STRINGS = [
    "num",
    "str",
    "bool",
    "arr",
    "obj",
    "lambda"
];

class CBType extends CarbonBase {

    constructor(typenum) {
        super("TYPE");

        if(typenum > STRINGS.length) {
            throw new Error("CBType typenum exceeds the amount of types!");
        }

        this.typenum = typenum;
    }

    static getNumByType(typestr) {
        return STRINGS.indexOf(typestr);
    }

    toJsString() {
        return STRINGS[this.typenum];
    }
}

module.exports = CBType;
