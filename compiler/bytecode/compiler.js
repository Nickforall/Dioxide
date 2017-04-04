const debug = require('debug')('bytecode-compiler');

const OP = require('../../shared/opcodes');
const colors = require('colors');
const Image = require('./image/image');
const Block = require('./image/block');
const CBType = require('../../vm/types/CBType')
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

function buildImage(prog, callback) {
    let image = new Image();

    let outimage = readTree(prog, image);

    if(callback) {
        callback(outimage);
    }

    return outimage;
}

function buildBlock(prog, image) {
    let block = new Block(image);

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
        debug("Handling an expression: " + expression.type)

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
            case "varCreate":
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
            case "propVar":
                buildObjProperty(expression);
                break;
            case "arrPropVar":
                buildArrayProp(expression);
                break;
            case "array":
                buildArray(expression);
                break;
            case "type":
                buildTypeConstant(expression);
                break;
            case "object":
                buildObject(expression);
                break;
            default:
                throw new Error(`Undefined SyntaxTree Expression Type "${expression.type}"`);
        }
    }

    function buildTypeConstant(expression) {
        let typenum = CBType.getNumByType(expression.value);
        image.appendToMain([OP.pushtype, typenum]);
    }

    function buildArrayProp(expression) {
        let varNameAddress = image.pushString(expression.value);
        image.appendToMain([OP.varload, varNameAddress]);

        for(prop of expression.props) {
            handleExpression(prop);
            image.pushToMain(OP.valprop);
        }
    }

    function buildArray(expression) {
        let entriesnum = expression.entries.length;

        for(entry of expression.entries) {
            handleExpression(entry)
        }

        image.appendToMain([OP.pusharr, entriesnum])
    }

    function buildObjProperty(expression) {
        let varNameAddress = image.pushString(expression.value);
        image.appendToMain([OP.varload, varNameAddress]);

        for(child of expression.props) {
            let propNameAddress = image.pushString(child.value);
            image.appendToMain([OP.prop, propNameAddress]);
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
        if(expression.func.type == "var") {
            let nameAddress = image.pushString(expression.func.value);
            image.appendToMain([OP.varload, nameAddress]);
        } else if (expression.func.type == "propVar") {
            buildObjProperty(expression.func)
        }

        for (var i = 0; i < expression.args.length; i++) {
            handleExpression(expression.args[i]);
        }

        image.appendToMain([OP.fncall, expression.args.length])
    }

    //builds assigning vars and reassigning them
    function buildAssign(expression) {
        if(expression.left.type == "varCreate") {
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

        if(expression.name) {
            let nameAddress = image.pushString(expression.name);
            image.appendToMain([OP.varcreate, nameAddress]);
        }
    }

    //builds if statement
    function buildIfStatement(expression) {
        let blockAddress = image.pushBlock(buildBlock(getFormattedBody(expression.then), image));

        handleExpression(expression.cond);
        image.appendToMain([OP.pushblock, blockAddress]);
        image.appendToMain([OP.ifblock]);
    }

    function buildObjectProp(prop) {
        if(!prop.name.type) throw new Error("Empty prop");
        if(prop.name.type == "var") prop.name.type = "str";
        if(prop.name.type !== "str") throw new Error("Names can only be strings right");

        handleExpression(prop.name);
        handleExpression(prop.prop);
        image.pushToMain(OP.setprop);
    }

    function buildObject(expression) {
        image.pushToMain(OP.objcreate);
        for(let prop of expression.entries) {
            buildObjectProp(prop);
        }
    }

    //loop through the top script
    for (var i = 0; i < program.length; i++) {
        let expression = program[i];
        handleExpression(expression);
    }

    //mark the end of a script with the halt opcode
    image.pushToMain(OP.halt)

    return image;
}

module.exports.compileTree = buildImage;
