const CBFunction = require("../types/CBFunction");
const CBString = require("../types/CBString");
const CBNumber = require("../types/CBNumber");
const CBBool = require("../types/CBBool");
const CBObject = require("../types/CBObject");
const CBNull = require("../types/CBNull");
const EventEmitter = require('events');

class CBEventEmitter extends EventEmitter {};

const eventslib = {
    createHandler: new CBFunction(false, (cb, options) => {
        let vmvars = this.CARBONVM;
        let handler = new CBEventEmitter();

        var on = function (cb, eventname) {
            if(cb.getTypename() !== "FUNCTION") throw new Error("Callback expected");
            if(eventname.getTypename() !== "STRING") throw new Error("Number expected");

            let jsEventName = eventname.toJsString();

            handler.on(jsEventName, function () {
                let args = Array.from(arguments);
                args.reverse();

                cb.execute(
                    vmvars.image,
                    args,
                    vmvars.parentid,
                    vmvars.scopemanager,
                    vmvars.cpu
                );
            });
        };

        var fire = function() {
            let args = Array.from(arguments);
            args.reverse();

            if(args[0] && args[0].getTypename() !== "STRING") throw new Error("Expecting first argument to be a string");
            args[0] = args[0].toJsString();

            handler.emit.apply(handler, args);
        };

        return new CBObject({
            isEventHandler: new CBBool(true),
            on: new CBFunction(false, on),
            fire: new CBFunction(false, fire)
        });
    })
}

module.exports = new CBObject(eventslib)
