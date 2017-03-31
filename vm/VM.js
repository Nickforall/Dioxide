const OP = require('../shared/opcodes');

const CarbonValueMath = require("./operations/basicmath");
const CarbonBooleanLogic = require("./operations/booleans");
const CBString = require("./types/CBString");
const CBNumber = require("./types/CBNumber");
const CBBool = require("./types/CBBool");
const CBObject = require("./types/CBObject");
const CBArray = require("./types/CBArray");
const CBNull = require("./types/CBNull");
const CBType = require("./types/CBType");
const CBFunction = require("./types/CBFunction");
const ScopeClasses = require('./Scopes');
const Block = require("./types/Block");

const Scope = ScopeClasses.Scope;
const ScopeManager = ScopeClasses.ScopeManager;

var globals = require('./stdlib/globals')

let mainScopeManager;

module.exports.createVM = function(image) {
    mainScopeManager = new ScopeManager();

    let globalScopeId = mainScopeManager.createScope(-1);

    loadGlobalSystemvars();
    cpu(image.main, mainScopeManager.createScope(globalScopeId), image);

    function loadGlobalSystemvars() {
        for (var key in globals) {
            if (globals.hasOwnProperty(key)) {
                mainScopeManager.getScope(globalScopeId)
                                .store(key, globals[key]);
            }
        }
    }
}

function cpu(code, _scopeid, image, loopcall) {
    let scopeid = _scopeid;

    let stack = [];
    var sp = -1;
    var cp = 0;

    var opcode = code[cp];

    function quickDebug() {
        console.log(stack)
        console.log("POINTERS:", sp, cp)
    }

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

                c = stack[sp--];

                if(!c || ( c._iscarbon && c.typename == "null")) {
                    throw new Error("Undefined Function " + b)
                }

                if(c.getTypename() !== "FUNCTION")
                    throw new Error("Call on non function type " + c.getTypename() + " not allowed.")
                if(c.isNative()) {
                    let ret = c.execute(image, a, scopeid, mainScopeManager, cpu);

                    stack[++sp] = new CBNull(); //since it isn't implemented, we push a null
                } else {
                    let ret = c.apply(image, a, scopeid, mainScopeManager, cpu);

                    //if it returned, load that value in
                    if(ret) {
                        stack[++sp] = ret;
                    } else {
                        //otherwise, return a null
                        stack[++sp] = new CBNull();
                    }
                }
                break;
            case OP.pushnum:
                stack[++sp] = new CBNumber(code[cp++]);
                break;
            case OP.pusharr:
                a = []; //array array
                c = code[cp++]; //length of arr
                for (var i = 1; i <= c; i++) {
                    a.push(stack[sp--]);
                }

                stack[++sp] = new CBArray(a);
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
                stack[++sp] = new CBBool(false);
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
            case OP.varload:
                stack[++sp] = mainScopeManager.getFrom(scopeid, string(code[cp++]));
                break;
            case OP.varcreate:
                a = stack[sp--]; //values
                stack[++sp] = mainScopeManager.getScope(scopeid)
                                              .store(string(code[cp++]), a);
                break;
            case OP.varstore:
                a = stack[sp--]; //values
                stack[++sp] = mainScopeManager.getScope(scopeid)
                                              .store(string(code[cp++]), a);
                break;
            case OP.pushblock:
                stack[++sp] = new Block(block(code[cp++]), image);
                break;
            case OP.fnlambda:
                c = code[cp++]; //length of args
                b = stack[sp--]; //block
                a = []; //args array

                for (var i = 0; i < c; i++) {
                    a.push(stack[sp--].toJsString());
                }

                stack[++sp] = new CBFunction(true, b, a);
                break;
            case OP.prop:
                a = new CBString(string(code[cp++]));
                b = stack[sp--];
                stack[++sp] = b.getProperty(a.toJsString());
                break;
            case OP.valprop:
                a = stack[sp--]; //val
                b = stack[sp--]; //array

                if(b.typename !== "ARRAY") throw new TypeError("Trying to get prop of non-array")

                stack[++sp] = b.getValProperty(a);
                break;
            case OP.pushtype:
                stack[++sp] = new CBType(code[cp++]);
                break;
            case OP.objcreate:
                stack[++sp] = new CBObject({});
                break;
            case OP.setprop:
                a = stack[sp--]; //prop
                b = stack[sp--]; //name
                c = stack[sp]; //object

                c.setProperty(b.toJsString(), a);
                break;
            default:
                throw new Error(`Unexpected opcode: ${opcode} on address ${cp}`);
        }

        opcode = code[cp];
    }

    function string(address) {
        return image.strings[address];
    }

    function block(address) {
        return image.blocks[address];
    }
}

module.exports.cpu = cpu;
module.exports.ScopeManager = ScopeManager;
