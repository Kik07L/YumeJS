function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import { format } from "date-fns";
var ANSIColorOpening;
(function(ANSIColorOpening) {
    ANSIColorOpening["Red"] = "\x1b[31m";
    ANSIColorOpening["Yellow"] = "\x1b[33m";
    ANSIColorOpening["Green"] = "\x1b[32m";
    ANSIColorOpening["Blue"] = "\x1b[34m";
})(ANSIColorOpening || (ANSIColorOpening = {}));
const ansiColorClosing = "\x1b[39m";
const levelColors = {
    debug: ANSIColorOpening.Blue,
    error: ANSIColorOpening.Red,
    info: ANSIColorOpening.Green,
    warn: ANSIColorOpening.Yellow
};
export class BaseLogger {
    log(messages, level = "info") {
        const opening = this.color ? "" : levelColors[level];
        const closing = this.color ? "" : ansiColorClosing;
        const formattedDate = format(Date.now(), "yyyy-MM-dd HH:mm:ss (x)");
        const message = messages.map((x)=>String(x)).join(" ");
        console[level](`${opening}[${formattedDate}] [${level}]: ${message} ${closing}`);
    }
    constructor(color = true){
        _define_property(this, "color", void 0);
        this.color = color;
    }
}
export class RawonLogger extends BaseLogger {
    info(...messages) {
        this.log(messages, "info");
    }
    debug(...messages) {
        if (this.options.prod) return;
        this.log(messages, "debug");
    }
    error(...messages) {
        this.log(messages, "error");
    }
    warn(...messages) {
        this.log(messages, "warn");
    }
    constructor(options){
        super(options.prod);
        _define_property(this, "options", void 0);
        this.options = options;
    }
}
