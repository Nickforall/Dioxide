const OP = require('./opcodes');
const colors = require('colors');

const operators = {
    "||": OP.opor,
    "&&": OP.opand,
    "<": OP.opsmaller,
    ">": OP.opgreater,
    "<=": OP.opsmallereq,
    ">=": OP.opgreatereq,
    "==": OP.opequal,
    "!=": OP.opnotequal,
    "+": OP.valadd,
    "-": OP.valsub,
    "*": OP.valmlp,
    "/": OP.valdiv,
    "%": OP.valmod
};

function readTree(prog) {
    let image = require('./image')();

    if(prog.type != "script" || !prog.prog) throw new Error("What? Incorrect syntax tree");
    const program = prog.prog;

    //basic for handling a tree object
    function handleExpression(expression) {
        switch (expression.type) {
            case "call":
                buildCall(expression);
                break;
            case "str":
                buildString(expression);
                break;
            case "num":
                buildNum(expression);
                break;
            case "binary":
                buildBinary(expression);
                break;
            default:
                throw new Error(`Undefined SyntaxTree Expression Type "${expression.type}"`);
        }
    }

    //build a call in bytecode
    function buildCall(expression) {
        let nameAddress = image.pushString(expression.func.value);

        image.appendToMain([OP.pushstr, nameAddress]);
        for (var i = 0; i < expression.args.length; i++) {
            handleExpression(expression.args[i]);
        }
    }

    //build a push number to stack operation
    function buildNum(expression) {
        image.appendToMain([OP.pushnum, expression.value]);
    }

    //build a push string to stack operation
    function buildString(expression) {
        let stringAddress = image.pushString(expression.value);
        image.appendToMain([OP.pushstr, stringAddress]);
    }

    function buildBinary(expression) {
        handleExpression(expression.left)
        handleExpression(expression.right)
        image.pushToMain(operators[expression.operator])
    }

    //loop through the top script
    for (var i = 0; i < program.length; i++) {
        var expression = program[i];
        handleExpression(expression);
    }

    return image;
}

module.exports.compileTree = readTree;
