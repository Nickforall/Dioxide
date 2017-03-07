const CBObject = require("./CBObject");
const CBNumber = require("./CBNumber");

class CBArray extends CBObject {
    constructor(array) {
        super({});

        this.typename = "ARRAY";
        this.length = new CBNumber(array.length);

        for (var i = 0; i < array.length; i++) {
            super.setProperty(new CBNumber(i), array[i]);
        }
    }
}

module.exports = CBArray;
