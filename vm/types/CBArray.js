const CBObject = require("./CBObject");
const CBNumber = require("./CBNumber");

class CBArray extends CBObject {
    constructor(array) {
        super({});

        this.typename = "ARRAY";
        this.length = new CBNumber(array.length);

        array.reverse();

        for (var i = 0; i < array.length; i++) {
            super.setProperty(i, array[i]);
        }
    }

    getValProperty(val) {
        if(val.typename == "NUMBER") {
            return super.getProperty(val.toJsNumber())
        } else if (val.typename == "STRING") {
            throw new TypeError("Arrays cannot have strings as key.")
        } else {
            throw new TypeError("Only numbers and strings can be keys to an object.")
        }
    }
}

module.exports = CBArray;
