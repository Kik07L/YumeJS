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
export class BaseCommand {
    constructor(client, meta){
        _define_property(this, "client", void 0);
        _define_property(this, "meta", void 0);
        this.client = client;
        this.meta = meta;
    }
}
