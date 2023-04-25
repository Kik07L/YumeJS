var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseEvent } from "../structures/BaseEvent";
import { Event } from "../utils/decorators/Event";
export let GuildBanRemoveEvent = class GuildBanRemoveEvent extends BaseEvent {
    execute(ban) {
        this.client.debugLog.logData("info", "GUILD_BAN_REMOVE", [
            [
                "User",
                `${ban.user.tag}(${ban.user.id})`
            ],
            [
                "Guild",
                `${ban.guild.name}(${ban.guild.id})`
            ],
            [
                "Reason",
                ban.reason ?? "[Not specified]"
            ]
        ]);
        void this.client.modlogs.handleBanRemove({
            ban
        });
    }
};
GuildBanRemoveEvent = __decorate([
    Event("guildBanRemove")
], GuildBanRemoveEvent);
