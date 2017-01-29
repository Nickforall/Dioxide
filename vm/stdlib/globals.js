const functions = {
    print: function(cbObject) {
        process.stdout.write(cbObject.toJsString());
    },
    println: function(cbObject) {
        process.stdout.write(cbObject.toJsString() + "\r\n")
    }
}

module.exports = functions;
