var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { checkQuery, handleVideos, searchTrack } from "../../utils/handlers/GeneralUtil";
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let PlayCommand = class PlayCommand extends BaseCommand {
    async execute(ctx) {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        const voiceChannel = ctx.member.voice.channel;
        if (ctx.additionalArgs.get("fromSearch")) {
            const tracks = ctx.additionalArgs.get("values");
            const toQueue = [];
            for (const track of tracks){
                const song = await searchTrack(this.client, track).catch(()=>null);
                if (!song) continue;
                toQueue.push(song.items[0]);
            }
            return handleVideos(this.client, ctx, toQueue, voiceChannel);
        }
        const query = (ctx.args.join(" ") || ctx.options?.getString("query")) ?? (ctx.additionalArgs.get("values") ? ctx.additionalArgs.get("values")[0] : undefined);
        if (!query) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("reusable.invalidUsage", {
                        prefix: `${this.client.config.mainPrefix}help`,
                        name: `${this.meta.name}`
                    }))
                ]
            });
        }
        if (ctx.guild?.queue && voiceChannel.id !== ctx.guild.queue.connection?.joinConfig.channelId) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("commands.music.play.alreadyPlaying", {
                        voiceChannel: ctx.guild.channels.cache.get((ctx.guild.queue.connection?.joinConfig).channelId)?.name ?? "#unknown-channel"
                    }))
                ]
            });
        }
        const queryCheck = checkQuery(query);
        const songs = await searchTrack(this.client, query).catch(()=>undefined);
        if (!songs || songs.items.length <= 0) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.play.noSongData"), true)
                ]
            });
        }
        return handleVideos(this.client, ctx, queryCheck.type === "playlist" ? songs.items : [
            songs.items[0]
        ], voiceChannel);
    }
};
__decorate([
    inVC,
    validVC,
    sameVC
], PlayCommand.prototype, "execute", null);
PlayCommand = __decorate([
    Command({
        aliases: [
            "p",
            "add"
        ],
        description: i18n.__("commands.music.play.description"),
        name: "play",
        slash: {
            description: i18n.__("commands.music.play.description"),
            options: [
                {
                    description: i18n.__("commands.music.play.slashQueryDescription"),
                    name: "query",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        usage: i18n.__("commands.music.play.usage")
    })
], PlayCommand);
