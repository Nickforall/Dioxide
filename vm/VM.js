const OP = require('../shared/opcodes');

module.exports = function(image) {
    cpu(image.main);

    function cpu(code) {
        let stack = [];
        var sp = -1;
        var cp = 0;

        var opcode = code[cp];

        while (opcode != OP.halt && cp < code.length) {
            cp++;

            switch (opcode) {

                default:
                    throw new Error(`Unexpected opcode: ${opcode} on address ${cp}`);
            }

            opcode = code[cp];
        }
    }

    function string(address) {


    }
}
