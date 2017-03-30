const CBBool = require("../types/CBBool");

function isNumber(value1, value2) {
    return (value1.getTypename() == "NUMBER" && value2.getTypename() == "NUMBER");
}

function oneIsType(value1, value2) {
    return (value1.getTypename() == "TYPE" || value2.getTypename() == "TYPE");
}

function isBool(value1, value2) {
    return (value1.getTypename() == "BOOLEAN" && value2.getTypename() == "BOOLEAN");
}

module.exports = {
    or: (value1, value2) => {
        if(isBool(value1, value2)) {
            return new CBBool(value1.toJsBoolean() || value2.toJsBoolean())
        } else {
            return new CBBool(false)
        }
    },
    and: (value1, value2) => {
        if(isBool(value1, value2)) {
            return new CBBool(value1.toJsBoolean() && value2.toJsBoolean())
        } else {
            return new CBBool(false)
        }
    },
    smaller: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() > value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    greater: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() < value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    greatereq: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() >= value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    },
    smallereq: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() <= value2.toJsNumber())
        } else if(oneIsType(value1, value2)) {
            return new CBBool(value1.toCbType().typenum == value1.toCbType().typenum)
        } else {
            return new CBBool(false)
        }
    },
    equal: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() == value2.toJsNumber())
        } else if(oneIsType(value1, value2)) {
            return new CBBool(value1.toCbType().typenum == value1.toCbType().typenum)
        } else {
            return new CBBool(false)
        }
    },
    notequal: (value1, value2) => {
        if(isNumber(value1, value2)) {
            return new CBBool(value1.toJsNumber() != value2.toJsNumber())
        } else {
            return new CBBool(false)
        }
    }
}
