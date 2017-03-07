const debug = require('debug')('blocks');

class Block {
    constructor(parent) {
        this.main = [];
        this.parent = parent;
    }

    pushString (str) {
        if(!(this.parent.type && this.parent.type == "IMAGE"))
            throw new Error("Infinite image generation loop in pushString");
        return this.parent.pushString(str);
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
        if(!(this.parent.type && this.parent.type == "IMAGE"))
            throw new Error("Infinite image generation loop in pushBlock");
        return this.parent.pushBlock(block);
    }

    serialize() {
        return this.main;
    }
}

module.exports = Block;
