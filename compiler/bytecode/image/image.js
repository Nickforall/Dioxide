const imageFormat = require("../../../compilerinfo.json").image_format;
const debug = require('debug')('image')

const Image = function () {
    let strings = [];
    var main = [];
    let blocks = [];

    return {
        type: "IMAGE",
        pushString: function (str) {
            debug("Added " + str + "to string registry");
            if(strings.indexOf(str) > -1) return strings.indexOf(str);
            return (strings.push(str) - 1);
        },
        pushToMain: function (bytecode) {
            debug("Pushed " + bytecode + "to main");
            main.push(bytecode);
        },
        appendToMain: function (array) {
            main = main.concat(array);
        },
        pushBlock: function (block) {
            return (blocks.push(block) - 1);
        },
        serialize: function() {
            return {
                imageFormat: imageFormat,
                strings: strings,
                main: main,
                blocks: blocks
            }
        }
    };
};

module.exports = Image;
