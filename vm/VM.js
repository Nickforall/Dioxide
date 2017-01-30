const OP = require('../shared/opcodes');

const CarbonValueMath = require("./operations/basicmath");
const CarbonBooleanLogic = require("./operations/booleans");
const CBString = require("./types/CBString");
const CBNumber = require("./types/CBNumber");
const CBBool = require("./types/CBBool");
const CBNull = require("./types/CBNull");

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
                case OP.null:
                    stack[++sp] = new CBNull();
                    break;
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
                        globals[b].apply(a);
                    } else {
                        throw new Error("Undefined Function " + b)
                    }

                    break;
                case OP.pushnum:
                    stack[++sp] = new CBNumber(code[cp++]);
                    break;
                case OP.valadd:
                    b = stack[sp--];
                    a = stack[sp--];
                    stack[++sp] = CarbonValueMath.add(a, b);
                    break;
                case OP.valmlp:
                    b = stack[sp--];
                    a = stack[sp--];
                    stack[++sp] = CarbonValueMath.multiply(a, b);
                    break;
                case OP.valdiv:
                    b = stack[sp--];
                    a = stack[sp--];
                    stack[++sp] = CarbonValueMath.divide(a, b);
                    break;
                case OP.valsub:
                    b = stack[sp--];
                    a = stack[sp--];
                    stack[++sp] = CarbonValueMath.subtract(a, b);
                    break;
                case OP.valmod:
                    b = stack[sp--];
                    a = stack[sp--];
                    stack[++sp] = CarbonValueMath.modulus(a, b);
                    break;
                case OP.pushtrue:
                    stack[++sp] = new CBBool(true);
                    break;
                case OP.pushfalse:
                    stack[++sp] = new CBool(false);
                    break;
                case OP.opor:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.or(a, b);
                    break;
                case OP.opand:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.and(a, b);
                    break;
                case OP.opsmaller:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.smaller(a, b);
                    break;
                case OP.opgreater:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.greater(a, b);
                    break;
                case OP.opgreatereq:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.greatereq(a, b);
                    break;
                case OP.opsmallereq:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.smallereq(a, b);
                    break;
                case OP.opequal:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.equal(a, b);
                    break;
                case OP.opequal:
                    a = stack[sp--];
                    b = stack[sp--];
                    stack[++sp] = CarbonBooleanLogic.notequal(a, b);
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
