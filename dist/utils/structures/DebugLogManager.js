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
import { BaseLogger } from "./RawonLogger";
export class DebugLogManager extends BaseLogger {
    logData(level, contextName, data) {
        if (!this.logEnabled) return;
        const messages = [
            `[${contextName}]`
        ];
        if (Array.isArray(data)) {
            for (const [key, value] of data){
                messages.push(`${key.trim() ? `${key}: ` : ""}${value}`);
            }
        } else {
            messages.push(data);
        }
        this.log([
            `${messages.join("\n")}\n`
        ], level);
    }
    constructor(logEnabled, dev = true){
        super(dev);
        _define_property(this, "logEnabled", void 0);
        this.logEnabled = logEnabled;
    }
}
