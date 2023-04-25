var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEmbed } from "../utils/functions/createEmbed";
import { BaseEvent } from "../structures/BaseEvent";
import { Event } from "../utils/decorators/Event";
import i18n from "../config";
import { ChannelType } from "discord.js";
export let MessageCreateEvent = class MessageCreateEvent extends BaseEvent {
    execute(message) {
        this.client.debugLog.logData("info", "MESSAGE_CREATE", [
            [
                "ID",
                message.id
            ],
            [
                "Guild",
                message.guild ? `${message.guild.name}(${message.guild.id})` : "DM"
            ],
            [
                "Channel",
                message.channel.type === ChannelType.DM ? "DM" : `${message.channel.name}(${message.channel.id})`
            ],
            [
                "Author",
                `${message.author.tag}(${message.author.id})`
            ]
        ]);
        if (message.author.bot || message.channel.type === ChannelType.DM || !this.client.commands.isReady) {
            return message;
        }
        if (this.getUserFromMention(message.content)?.id === this.client.user?.id) {
            message.reply({
                embeds: [
                    createEmbed("info", `👋 **|** ${i18n.__mf("events.createMessage", {
                        author: message.author.toString(),
                        prefix: `\`${this.client.config.mainPrefix}\``
                    })}`)
                ]
            }).catch((e)=>this.client.logger.error("PROMISE_ERR:", e));
        }
        const pref = this.client.config.altPrefixes.concat(this.client.config.mainPrefix).find((p)=>{
            if (p === "{mention}") {
                // eslint-disable-next-line prefer-named-capture-group
                const userMention = /<@(!)?\d*?>/.exec(message.content);
                if (userMention?.index !== 0) return false;
                const user = this.getUserFromMention(userMention[0]);
                return user?.id === this.client.user?.id;
            }
            return message.content.startsWith(p);
        });
        if (pref) {
            this.client.commands.handle(message, pref);
        }
    }
    getUserFromMention(mention) {
        // eslint-disable-next-line prefer-named-capture-group
        const matches = /^<@!?(\d+)>$/.exec(mention);
        if (!matches) return undefined;
        const id = matches[1];
        return this.client.users.cache.get(id);
    }
};
MessageCreateEvent = __decorate([
    Event("messageCreate")
], MessageCreateEvent);
