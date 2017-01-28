const OP = require('../../shared/opcodes');
const colors = require('colors');
const Image = require('./image/image');
const Block = require('./image/block');

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

function buildImage(prog) {
    let image = Image();

    return readTree(prog, image);
}

function buildBlock(prog, image) {
    let block = Block(image);

    return readTree(prog, block).serialize();
}

function getFormattedBody(expression) {
    if(expression.type == "script") return expression;

    let prog = []
    prog.push(expression)

    return {
        type: "script",
        prog: prog
    }
}

function readTree(prog, image) {
    if(prog.type != "script" || !prog.prog) throw new Error("What? Incorrect syntax tree");
    const program = prog.prog;

    //basic for handling a tree object
    function handleExpression(expression) {
        switch (expression.type) {
            case "var":
                buildVarLoad(expression);
                break;
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
            case "varInit":
                buildVarInitNull(expression);
                break;
            case "bool":
                buildBool(expression)
                break;
            case "assign":
                buildAssign(expression);
                break;
            case "function":
                buildLambda(expression);
                break;
            case "null":
                buildNull(expression);
                break;
            case "if":
                buildIfStatement(expression);
                break;
            default:
                throw new Error(`Undefined SyntaxTree Expression Type "${expression.type}"`);
        }
    }

    function buildNull(expression) {
        image.pushToMain(OP.null)
    }

    //build a boolean
    function buildBool(expression) {
        expression.value ? image.pushToMain(OP.pushtrue) : image.pushToMain(OP.pushfalse)
    }

    //build a call in bytecode
    function buildCall(expression) {
        let nameAddress = image.pushString(expression.func.value);

        image.appendToMain([OP.pushstr, nameAddress]);
        for (var i = 0; i < expression.args.length; i++) {
            handleExpression(expression.args[i]);
        }

        image.appendToMain([OP.fncall, expression.args.length])
    }

    //builds assigning vars and reassigning them
    function buildAssign(expression) {
        if(expression.left.type == "varInit") {
            var nameAddress = image.pushString(expression.left.value);
            handleExpression(expression.right);
            image.appendToMain([OP.varcreate, nameAddress]);
        } else if ((expression.left.type == "var")) {
            var nameAddress = image.pushString(expression.left.value);
            handleExpression(expression.right);
            image.appendToMain([OP.varstore, nameAddress]);
        }
    }

    //reassigns a variable in storage
    function buildVarInitNull(expression) {
        let nameAddress = image.pushString(expression.value);
        image.appendToMain([OP.null, OP.varcreate, nameAddress]);
    }

    //loads a variable from storage
    function buildVarLoad(expression) {
        let nameAddress = image.pushString(expression.value);
        image.appendToMain([OP.varload, nameAddress])
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

    //builds binary expressions
    function buildBinary(expression) {
        handleExpression(expression.left)
        handleExpression(expression.right)
        image.pushToMain(operators[expression.operator])
    }

    //builds lambda
    function buildLambda(expression) {
        let blockAddress = image.pushBlock(buildBlock(getFormattedBody(expression.body), image));

        for (var i = 0; i < expression.args.length; i++) {
            let stringAddress = image.pushString(expression.args[i])
            image.appendToMain([OP.pushstr, stringAddress]);
        }

        image.appendToMain([OP.pushblock, blockAddress]);
        image.appendToMain([OP.fnlambda, expression.args.length]);
    }

    //builds if statement
    function buildIfStatement(expression) {
        let blockAddress = image.pushBlock(buildBlock(getFormattedBody(expression.then), image));

        handleExpression(expression.cond);
        image.appendToMain([OP.pushblock, blockAddress]);
        image.appendToMain([OP.ifblock]);
    }

    //loop through the top script
    for (var i = 0; i < program.length; i++) {
        let expression = program[i];
        handleExpression(expression);
    }

    image.pushToMain(OP.halt)

    return image;
}

module.exports.compileTree = buildImage;
