const imageFormat = require("../../../compilerinfo.json").image_format;
const debug = require('debug')('image');

class Image {
    constructor() {
        this.type = "IMAGE";
        this.strings = [];
        this.main = [];
        this.blocks = [];
    }

    pushString (str) {
        debug("Added \"" + str + "\" to string registry");
        if(this.strings.indexOf(str) > -1) return this.strings.indexOf(str);
        return (this.strings.push(str) - 1);
    }

    pushToMain (bytecode) {
        debug("Pushed " + bytecode + " to main");
        this.main.push(bytecode);
    }

    appendToMain (array) {
        this.main = this.main.concat(array);

        for (let bytecode of array) {
            debug("Pushed " + bytecode + " to main");
        }
    }

    pushBlock (block) {
        return (this.blocks.push(block) - 1);
        debug("Pushed block to main");
    }

    serialize() {
        return {
            imageFormat: this.imageFormat,
            strings: this.strings,
            main: this.main,
            blocks: this.blocks
        }
    }
}

module.exports = Image;
