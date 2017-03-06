const CarbonBase = require("./CarbonBase");
const CBNull = require("./CBNull");

const VM = require("../VM");

class CBFunction extends CarbonBase {
    constructor(native, codeblock, arglist) {
        super("FUNCTION");

        this.args = arglist;
        this.native = native;
        this.content = codeblock;
    }

    toJsString() {
        return "FUNCTION"
    }

    getCodeBlock() {
        return this.content;
    }

    isNative() {
        return this.native;
    }

    apply(image, args, parentid, scopemanager, cpu) {
        if(!this.native) {
            this.content.apply({
                CARBONVM: {
                    image: image,
                    args: args,
                    parentid: parentid,
                    scopemanager: scopemanager,
                    cpu: cpu
                }
            }, args);
        } else {
            throw new Error("The VM tried applying a native function as non-native");
        }
    }

    toJsBoolean() {
        return false;
    }

    execute(image, args, parentid, scopemanager, cpu) {
        let scopeid = scopemanager.createScope(parentid);

        //feed our args in the function
        let scope = scopemanager.getScope(scopeid);
        scope.feed(this.toArgsObject(args));

        //execute its instructions
        cpu(this.getCodeBlock().block, scopeid, image, true);
    }

    toArgsObject(argvals) {
        let obj = {};

        //Make sure args are in the right order (Dioxide#6)
        while (this.args.length > argvals.length) {
            argvals.unshift(new CBNull());
        }

        for (var i = 0; i < this.args.length; i++) {
            obj[this.args[i]] = argvals[i];
        }
        
        return obj;
    }
}

module.exports = CBFunction;
