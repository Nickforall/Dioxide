const os = require("os");
const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBObject = require("../types/CBObject");

const system = {
    platform: new CBString(os.platform()),
    home: new CBString(os.homedir()),
    uptime: new CBFunction(false, function() {
        return new CBNumber(Math.floor(os.uptime()));
    }),
    freeMemory: new CBFunction(false, function() {
        return new CBNumber(os.freemem());
    }),
    totalMemory: new CBFunction(false, function() {
        return new CBNumber(os.totalmem());
    }),
    arch: new CBNumber(os.arch()),
}

module.exports = new CBObject(system);
