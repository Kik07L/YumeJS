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
import { OperationManager } from "./OperationManager";
import { readFile, writeFile } from "fs/promises";
export class JSONDataManager {
    get data() {
        return this._data;
    }
    async save(data) {
        await this.manager.add(async ()=>{
            const dat = data();
            await writeFile(this.fileDir, JSON.stringify(dat));
            return undefined;
        });
        return this.load();
    }
    async load() {
        try {
            await this.manager.add(async ()=>{
                this._data = JSON.parse((await readFile(this.fileDir, "utf8")).toString());
                return undefined;
            });
            return this._data;
        } catch  {
            return this.data;
        }
    }
    constructor(fileDir){
        _define_property(this, "fileDir", void 0);
        _define_property(this, "manager", void 0);
        _define_property(this, "_data", void 0);
        this.fileDir = fileDir;
        this.manager = new OperationManager();
        this._data = null;
        void this.load();
    }
}
