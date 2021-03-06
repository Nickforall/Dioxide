function TokenStream(input) {
    var current = null;
    const keywords = [
        "var",
        "const",
        "let",
        "if",
        "then",
        "else",
        "fn",
        "true",
        "false",
        "λ",
        "null"
    ];

    const types = [
        "num",
        "str",
        "bool",
        "arr",
        "obj",
        "lambda"
    ]

    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : input.croak
    };

    //token constructor
    function token(type, value) {
        var lol = {
            type: type,
            value: value
        };
        //DEBUG: console.log(lol);
        return lol;
    }

    //whether a word is a keyword
    function isKeyword(x) {
        return keywords.indexOf(x) > -1;
    }

    function isType(x) {
        return types.indexOf(x) > -1;
    }

    //whether a character is a digit
    function isDigit(ch) {
        return /[0-9]/i.test(ch);
    }

    //whether a character is the start of an id
    function isIdStart(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    //whether an id is the start of an id
    function isId(ch) {
        return isIdStart(ch) || "?!-<>=0123456789".indexOf(ch) > -1;
    }

    //whether a character is an operator
    function isOpChar(ch) {
        return "+-*/%=&|<>!".indexOf(ch) > -1;
    }

    //whether a char is punctuation
    function isPunc(ch) {
        return ",;(){}[]:.".indexOf(ch) > -1;
    }

    //whether a char is a whitespace
    function isWhitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }

    //read until something is false
    function readWhile(predicate) {
        var str = "";

        //while the file hasn't ended, or the predicate returns true
        while (!input.eof() && predicate(input.peek())) {
            str += input.next();
        }

        return str;
    }

    //reads a number
    function readNumber() {

        //whether the number has already had a point
        var hasPoint = false;
        var number = readWhile((ch) => {

            //making sure we only have one point
            if (ch == ".") {
                if (hasPoint) return false;
                hasPoint = true;
                return true;
            }

            //as long as it's a digit tho
            return isDigit(ch);
        });

        return token("num", parseFloat(number));
    }

    function readIdent() {
        var id = readWhile(isId);

        if(isKeyword(id)) {
            return token("kw", id);
        } else if(isType(id)){
            return token("type", id);
        }

        return token("var", id)
    }

    function readEscaped(end) {

        var escaped = false
        var str = "";

        input.next();

        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }

    function readString() {
        return token("str", readEscaped('"'));
    }

    function skipComment(ending, ending_second) {
        if(ending_second) {
            readWhile((ch) => {
                if(ch == ending) {
                    return input.peekForward(1) != ending_second
                }

                return true;
            });

            input.next();
        } else {
            readWhile((ch) => { return ch != ending});
        }

        input.next();
    }

    function readNext() {

        //whitespaces aren't interesting
        readWhile(isWhitespace);

        //if we're on the end of the input stream, stahp
        if (input.eof()) return null;

        //take a look at the next char, input.next() is only called upon token generation
        var ch = input.peek();

        //skip comments.
        if (ch == "#" || ch == "/" && input.peekForward(1) == "/") {
            skipComment("\n");
            return readNext();
        }

        if (ch == "/" && input.peekForward(1) == "*") {
            skipComment("*", "/");
            return readNext();
        }

        //read whole tokens if it starts with a possibility
        if (ch == '"') return readString();
        if (isDigit(ch)) return readNumber();
        if (isIdStart(ch)) return readIdent();

        //simple tokens that don't require a full reading function
        if (isPunc(ch)) return token("punc", input.next());

        if (isOpChar(ch)) return token("op", readWhile(isOpChar));

        //if we haven't returned here yet, there's an error.
        input.croak("Can't handle character: " + ch);
    }

    //peek at the next token without moving the cursor
    function peek() {
        return current || (current = readNext());
    }

    //go to the next token, and move the cursor to
    function next() {
        var tok = current;
        current = null;
        return tok || readNext();
    }

    //whether we're at the end of file
    function eof() {
        return peek() == null;
    }
}

module.exports = TokenStream;
