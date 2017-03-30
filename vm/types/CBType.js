const CarbonBase = require('./CarbonBase');

class CBType extends CarbonBase {
    const NUM = 0;
    const STRING = 1;
    const BOOL = 2;
    const ARRAY = 3;
    const OBJECT = 4;
    const LAMBDA = 5;

    const STRINGS = [
        "num",
        "str",
        "bool",
        "arr",
        "obj",
        "lambda"
    ];

    constructor(typenum) {
        super("TYPE");

        if(typenum > this.STRINGS.length) {
            throw new Error("CBType typenum exceeds the amount of types!");
        }

        this.typenum = typenum;
    }

    getTypename() {
        return this.toJsString();
    }

    toJsString() {
        return this.STRINGS[this.typenum];
    }

    toCbType() {
        return this;
    }
}

module.exports = CBType;
