const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");

module.exports = {
    add: function (value1, value2) {
        if(value1.getTypename() == "NUMBER" && value2.getTypename() == "NUMBER") {
            return new CBNumber(value1.toJsNumber() + value2.toJsNumber());
        } else {
            return new CBString(value1.toJsString() + value2.toJsString());
        }
    }
}
