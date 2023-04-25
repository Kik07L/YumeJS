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
import { importURLToString } from "../utils/functions/importURLToString";
import { DebugLogManager } from "../utils/structures/DebugLogManager";
import { JSONDataManager } from "../utils/structures/JSONDataManager";
import { CommandManager } from "../utils/structures/CommandManager";
import { ModerationLogs } from "../utils/structures/ModerationLogs";
import { EventsLoader } from "../utils/structures/EventsLoader";
import { ClientUtils } from "../utils/structures/ClientUtils";
import { RawonLogger } from "../utils/structures/RawonLogger";
import { soundcloud } from "../utils/handlers/SoundCloudUtil";
import { SpotifyUtil } from "../utils/handlers/SpotifyUtil";
import * as config from "../config";
import { Client } from "discord.js";
import { resolve } from "node:path";
import got from "got";
export class Rawon extends Client {
    constructor(opt){
        super(opt);
        _define_property(this, "startTimestamp", 0);
        _define_property(this, "config", config);
        _define_property(this, "commands", new CommandManager(this, resolve(importURLToString(import.meta.url), "..", "commands")));
        _define_property(this, "events", new EventsLoader(this, resolve(importURLToString(import.meta.url), "..", "events")));
        _define_property(this, "data", new JSONDataManager(resolve(process.cwd(), "data.json")));
        _define_property(this, "logger", new RawonLogger({
            prod: this.config.isProd
        }));
        _define_property(this, "debugLog", new DebugLogManager(this.config.debugMode, this.config.isProd));
        _define_property(this, "modlogs", new ModerationLogs(this));
        _define_property(this, "spotify", new SpotifyUtil(this));
        _define_property(this, "utils", new ClientUtils(this));
        _define_property(this, "soundcloud", soundcloud);
        _define_property(this, "request", got.extend({
            hooks: {
                beforeError: [
                    (error)=>{
                        this.debugLog.logData("error", "GOT_REQUEST", [
                            [
                                "URL",
                                error.options.url?.toString() ?? "[???]"
                            ],
                            [
                                "Code",
                                error.code
                            ],
                            [
                                "Response",
                                error.response?.rawBody.toString("ascii") ?? "[???]"
                            ]
                        ]);
                        return error;
                    }
                ],
                beforeRequest: [
                    (options)=>{
                        this.debugLog.logData("info", "GOT_REQUEST", [
                            [
                                "URL",
                                options.url?.toString() ?? "[???]"
                            ],
                            [
                                "Method",
                                options.method
                            ],
                            [
                                "Encoding",
                                options.encoding ?? "UTF-8"
                            ],
                            [
                                "Agent",
                                options.agent.http ? "HTTP" : "HTTPS"
                            ]
                        ]);
                    }
                ]
            }
        }));
        _define_property(this, "build", async ()=>{
            this.startTimestamp = Date.now();
            this.events.load();
            await this.login();
            return this;
        });
    }
}
