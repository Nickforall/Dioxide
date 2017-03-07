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
        this.main.push(bytecode);
    }

    appendToMain (array) {
        this.main = this.main.concat(array);
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
