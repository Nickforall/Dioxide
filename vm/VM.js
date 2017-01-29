const OP = require('../shared/opcodes');

const CBString = require("./types/CBString")

var globals = require('./stdlib/globals')

module.exports = function(image) {
    cpu(image.main);

    function cpu(code) {
        let stack = [];
        var sp = -1;
        var cp = 0;

        var opcode = code[cp];

        while (opcode != OP.halt && cp < code.length) {
            cp++;

            var a, b, c;

            switch (opcode) {
                case OP.pushstr:
                    stack[++sp] = new CBString(string(code[cp++]));
                    break;
                case OP.fncall:
                    a = []; //args array
                    c = code[cp++]; //length of args
                    for (var i = 1; i <= c; i++) {
                        a.push(stack[sp--]);
                    }

                    b = stack[sp--].toJsString(); //function name

                    if(globals[b]) {
                        globals[b].apply({}, a);
                    } else {
                        throw new Error("Undefined Function " + b)
                    }

                    break;
                default:
                    throw new Error(`Unexpected opcode: ${opcode} on address ${cp}`);
            }

            //console.log(stack);

            opcode = code[cp];
        }

        process.stdout.write("\n")
    }

    function string(address) {
        return image.strings[address];
    }
}
