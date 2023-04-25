var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEmbed } from "../utils/functions/createEmbed";
import { BaseEvent } from "../structures/BaseEvent";
import { Event } from "../utils/decorators/Event";
import { entersState, VoiceConnectionStatus } from "@discordjs/voice";
import { ChannelType } from "discord.js";
import i18n from "i18n";
export let ChannelUpdateEvent = class ChannelUpdateEvent extends BaseEvent {
    async execute(oldChannel, newChannel) {
        this.client.debugLog.logData("info", "CHANNEL_UPDATE_EVENT", [
            [
                "Channel",
                `${newChannel.name}(${newChannel.id})`
            ],
            [
                "Type",
                newChannel.type.toString()
            ]
        ]);
        if (!newChannel.guild.queue || newChannel.id !== newChannel.guild.queue.connection?.joinConfig.channelId || oldChannel.type !== ChannelType.GuildVoice && oldChannel.type !== ChannelType.GuildStageVoice || newChannel.type !== ChannelType.GuildVoice && newChannel.type !== ChannelType.GuildStageVoice) return;
        if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
            const queue = newChannel.guild.queue;
            const msg = await queue.textChannel.send({
                embeds: [
                    createEmbed("info", i18n.__("events.channelUpdate.reconfigureConnection"))
                ]
            });
            queue.connection?.configureNetworking();
            entersState(queue.connection, VoiceConnectionStatus.Ready, 20000).then(()=>{
                void msg.edit({
                    embeds: [
                        createEmbed("success", i18n.__("events.channelUpdate.connectionReconfigured"), true)
                    ]
                });
            }).catch(()=>{
                queue.destroy();
                this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Unable to re-configure network on ${newChannel.guild.name} voice channel, the queue was deleted.`);
                void msg.edit({
                    embeds: [
                        createEmbed("error", i18n.__("events.channelUpdate.unableReconfigureConnection"), true)
                    ]
                });
            });
        }
    }
};
ChannelUpdateEvent = __decorate([
    Event("channelUpdate")
], ChannelUpdateEvent);
