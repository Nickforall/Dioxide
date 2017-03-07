const CBObject = require("./types/CBObject");

class CBArray extends CBObject {
    constructor(array) {
        super({});

        this.typename = "ARRAY";

        for (var i = 0; i < array.length; i++) {
            super.setProperty(i, array[i]);
        }
    }

}
