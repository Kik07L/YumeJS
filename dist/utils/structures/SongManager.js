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
import { Collection, SnowflakeUtil } from "discord.js";
export class SongManager extends Collection {
    addSong(song, requester) {
        const key = SnowflakeUtil.generate().toLocaleString();
        const data = {
            index: this.id++,
            key,
            requester,
            song
        };
        this.set(key, data);
        return key;
    }
    set(key, data) {
        this.client?.debugLog.logData("info", "SONG_MANAGER", `New value added to ${this.guild.name}(${this.guild.id}) song manager. Key: ${key}`);
        return super.set(key, data);
    }
    delete(key) {
        this.client?.debugLog.logData("info", "SONG_MANAGER", `Value ${key} deleted from ${this.guild.name}(${this.guild.id}) song manager.`);
        return super.delete(key);
    }
    sortByIndex() {
        return this.sort((a, b)=>a.index - b.index);
    }
    constructor(client, guild){
        super();
        _define_property(this, "client", void 0);
        _define_property(this, "guild", void 0);
        _define_property(this, "id", void 0);
        this.client = client;
        this.guild = guild;
        this.id = 0;
    }
}
