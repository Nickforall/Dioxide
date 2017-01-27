const Block = function (parent) {
    var main = [];

    return {
        pushString: function (str) {
            if(!(parent.type && parent.type == "IMAGE")) throw new Error("Infinite image generation loop in pushString");
            return parent.pushString(str);
        },
        pushToMain: function (bytecode) {
            main.push(bytecode);
        },
        appendToMain: function (array) {
            main = main.concat(array);
        },
        pushBlock: function (block) {
            if(!(parent.type && parent.type == "IMAGE")) throw new Error("Infinite image generation loop in pushBlock");
            return parent.pushBlock(block);
        },
        serialize: function() {
            return main;
        }
    };
};

module.exports = Block;
