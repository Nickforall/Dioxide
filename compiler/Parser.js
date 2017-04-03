var FALSE = { type: "bool", value: false };

function parse(input) {
    const PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };

    return parseTopLevel();

    function isPunc(ch) {
        var tok = input.peek();
        return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
    }

    //peek whether the next token is a keyword of a certain type
    function isKeyword(kw) {
        var tok = input.peek();
        return tok && tok.type == "kw" && (!kw || tok.value == kw) && tok;
    }

    function isType(tp) {
        var tok = input.peek();
        return tok && tok.type == "type" && (!tp || tok.value == tp) && tok;
    }

    function isOperator(op) {
        var tok = input.peek();
        return tok && tok.type == "op" && (!op || tok.value == op) && tok;
    }

    function skipPunc(ch) {
        if (isPunc(ch)) input.next();
        else input.croak("Expecting punctuation: \"" + ch + "\"");
    }

    function skipKeyword(kw) {
        if (isKeyword(kw)) input.next();
        else input.croak("Expecting keyword: \"" + kw + "\"");
    }

    function skipOperator(op) {
        if (isOperator(op)) input.next();
        else input.croak("Expecting operator: \"" + op + "\"");
    }

    function unexpected() {
        input.croak("Unexpected token: " + JSON.stringify(input.peek()));
    }

    function maybe_binary(left, my_prec) {
        var tok = isOperator();
        if (tok) {
            var his_prec = PRECEDENCE[tok.value];
            if (his_prec > my_prec) {
                input.next();
                return maybe_binary({
                    type     : tok.value == "=" ? "assign" : "binary",
                    operator : tok.value,
                    left     : left,
                    right    : maybe_binary(parseAtom(), his_prec)
                }, my_prec);
            }
        }
        return left;
    }

    function delimited(start, stop, separator, parser) {
        var a = [], first = true;
        skipPunc(start);
        while (!input.eof()) {
            if (isPunc(stop)) break;
            if (first) first = false; else skipPunc(separator);
            if (isPunc(stop)) break;
            a.push(parser());
        }
        skipPunc(stop);
        return a;
    }

    function parseCall(func) {
        return {
            type: "call",
            func: func,
            args: delimited("(", ")", ",", parseExpression),
        };
    }

    function parseVarName() {
        var name = input.next();
        if (name.type != "var") input.croak("Expecting variable name");
        return name.value;
    }

    function parseVarInitializer() {
        skipKeyword("var");

        return {
            type: "varInit",
            value: parseVarName()
        }
    }

    function parseIf() {

        //ignore the keyword
        skipKeyword("if");

        //expression is followed (no parenthesis)
        var cond = parseExpression();
        //check whether we are using a code block, or an if then statement
        if (!isPunc("{")) skipKeyword("then");
        var then = parseExpression();
        var ret = {
            type: "if",
            cond: cond,
            then: then,
        };
        if (isKeyword("else")) {
            input.next();
            ret.else = parseExpression();
        }
        return ret;
    }

    function parseLambda() {
        let name;

        if(isPunc("(")) {
            name = undefined;
        } else {
            name = parseVarName();
        }

        return {
            type: "function",
            name: name,
            args: delimited("(", ")", ",", parseVarName),
            body: parseScript()
        };
    }

    function parseBool() {
        return {
            type  : "bool",
            value : input.next().value == "true"
        };
    }
    function parseNull() {
        return {
            type: "null",
            value: input.next().value ? null : null
        }
    }

    function maybeCall(expr) {
        expr = expr();
        return isPunc("(") ? parseCall(expr) : expr;
    }

    function makeObjectNotation(tok) {
        var end = {
            type: "propVar",
            value: tok.value,
            props: []
        };

        var next;

        while (!input.eof()) {
            if(!isPunc(".")) break;

            skipPunc(".");

            if(input.peek().type == "var") {
                end.props.push(input.next());
            } else {
                skipPunc(".");
                break;
            }
        }

        return end;
    }

    function parseArrayProp(tok) {
        var end = {
            type: "arrPropVar",
            value: tok.value,
            props: []
        };

        while (!input.eof()) {
            if(!isPunc("[")) break;

            skipPunc("[");
            end.props.push(parseExpression());
            skipPunc("]");
        }

        return end;
    }

    function parseArray() {
        return {
            type: "array",
            entries: delimited("[", "]", ",", parseExpression)
        };
    }

    function parseObjectEntry() {
        let propertyName = parseExpression();
        skipPunc(":");
        let property = parseExpression();

        return {
            type: "objectProp",
            name: propertyName,
            prop: property
        }
    }

    function parseObject() {
        return {
            type: "object",
            entries: delimited("{", "}", ",", parseObjectEntry)
        };
    }

    function parseAtom() {
        return maybeCall(() => {
            if (isPunc("(")) {
                input.next();
                var exp = parseExpression();
                skipPunc(")");
                return exp;
            }

            if(isPunc("[")) {
                return parseArray();
            }

            if(isPunc("{")) {
                return parseObject();
            }

            if (isKeyword("if")) return parseIf();
            if (isKeyword("null")) return parseNull();
            if (isKeyword("true") || isKeyword("false")) return parseBool();
            if (isKeyword("var")) return parseVarInitializer();
            if (isType()) return parseType();
            if (isKeyword("fn") || isKeyword("λ")) {
                input.next();
                return parseLambda();
            }

            //if none of these, it's going to be a simple expression
            var tok = input.next();
            if (tok.type == "num" || tok.type == "str")
                return tok;

            if(tok.type == "var")
                if(isPunc(".")) {
                    return makeObjectNotation(tok);
                } else if(isPunc("[")){
                    return parseArrayProp(tok);
                } else {
                    return tok;
                }

            unexpected();
        });
    }

    function parseType() {
        return {
            type  : "type",
            value : input.next().value
        };
    }

    function parseTopLevel() {
        var prog = [];

        while (!input.eof()) {
            prog.push(parseExpression());
            if (!input.eof()) skipPunc(";");
        }

        return { type: "script", prog: prog };
    }

    function parseScript() {
        var prog = delimited("{", "}", ";", parseExpression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: "script", prog: prog };
    }

    function parseExpression() {
        return maybeCall(() => {
            return maybe_binary(parseAtom(), 0);
        });
    }
}

module.exports = parse;
