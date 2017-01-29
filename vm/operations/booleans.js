const CBBool = require("../types/CBBool");

function isNumber(value1, value2) {
    return (value1.getTypename() == "NUMBER" && value2.getTypename() == "NUMBER");
}

function isBool(value1, value2) {
    return (value1.getTypename() == "BOOLEAN" && value2.getTypename() == "BOOLEAN");
}

module.exports = {
    or: function(value1, value2) {
        if(isBool(value1, value2)) {
            return new CBBool(value1.toJsBoolean() || value2.toJsBoolean())
        } else {
            return new CBBool(false)
        }
    },
    and: function(value1, value2) {
        if(isBool(value1, value2)) {
            return new CBBool(value1.toJsBoolean() && value2.toJsBoolean())
        } else {
            return new CBBool(false)
        }
    },
    smaller: function(value1, value2) {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() > value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    greater: function(value1, value2) {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() < value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    greatereq: function(value1, value2) {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() >= value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    smallereq: function(value1, value2) {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() <= value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    equal: function(value1, value2) {
        if(isNumber(value1, value2)) {
            console.log("REACHED EQ")
            return new CBBool(value1.toJsNumber() == value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    notequal: function(value1, value2) {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() != value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    }
}
