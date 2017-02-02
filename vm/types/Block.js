class Block {
    constructor(block, image) {
        this.block = block;
        this.image = image;
    }

    getExecutable() {
        return this.image;
    }
}

module.exports = Block;
