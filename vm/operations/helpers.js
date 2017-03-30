const CBType = require("../types/CBType");

module.exports.baseToType = function (base) {
    switch (base.typename) {
        case "NUMBER":
            return new CBType(0);
        case "STRING":
            return new CBType(1);
        case "BOOLEAN":
            return new CBType(2);
        case "ARRAY":
            return new CBType(3);
        case "OBJECT":
            return new CBType(4);
        case "FUNCTION":
            return new CBType(5);
        case "TYPE":
            return base;

        default:
            throw new Error("This CarbonBase is typeless? (" + typename + ")")
    }
};
