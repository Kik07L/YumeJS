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
import { pathStringToURLString } from "../functions/pathStringToURLString";
import { promises as fs } from "node:fs";
import { resolve } from "node:path";
export class EventsLoader {
    load() {
        fs.readdir(resolve(this.path)).then(async (events)=>{
            this.client.logger.info(`Loading ${events.length} events...`);
            for (const file of events){
                const event = await this.client.utils.import(pathStringToURLString(resolve(this.path, file)), this.client);
                if (event === undefined) throw new Error(`File ${file} is not a valid event file.`);
                this.client.logger.info(`Events on listener ${event.name.toString()} has been added.`);
                this.client.on(event.name, (...args)=>event.execute(...args));
            }
        }).catch((err)=>this.client.logger.error("EVENTS_LOADER_ERR:", err)).finally(()=>this.client.logger.info("Done loading events."));
    }
    constructor(client, path){
        _define_property(this, "client", void 0);
        _define_property(this, "path", void 0);
        this.client = client;
        this.path = path;
    }
}
