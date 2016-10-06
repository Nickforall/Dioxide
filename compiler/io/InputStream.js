function InputStream(input) {
    //Variables of position
    var pos = 0;
    var line = 0;
    var col = 0;

    //throw all kinds of shit at people
    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };

    //Shows the next value, and discards it from stream
    function next() {
        //gets the next character from the stream
        var ch = input.charAt(pos++);
        //if it's a new line, move the line down and shit
        //else, don't
        if (ch == "\n") line++, col = 0; else col++;
        return ch;
    }

    //shows the next value, but doesn't discard it yet.
    function peek() {
        return input.charAt(pos);
    }

    //if the end of the file is reached, this will return true
    function eof() {
        return peek() == "";
    }

    //Throws an error with the appropiate location
    function croak(msg) {
        //wow, we report location, it's amazing!
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}

module.exports = InputStream;
