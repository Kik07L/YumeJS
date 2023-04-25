var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import { play } from "../../utils/handlers/GeneralUtil";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let SkipToCommand = class SkipToCommand extends BaseCommand {
    async execute(ctx) {
        const djRole = await this.client.utils.fetchDJRole(ctx.guild);
        if (this.client.data.data?.[ctx.guild.id]?.dj?.enable && this.client.channels.cache.get(ctx.guild?.queue?.connection?.joinConfig.channelId ?? "").members.size > 2 && !ctx.member?.roles.cache.has(djRole?.id ?? "") && !ctx.member?.permissions.has("ManageGuild")) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.skipTo.noPermission"), true)
                ]
            });
        }
        const targetType = ctx.args[0] ?? ctx.options?.getSubcommand() ?? ctx.options?.getNumber("position");
        if (!targetType) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("reusable.invalidUsage", {
                        prefix: `${this.client.config.mainPrefix}help`,
                        name: `${this.meta.name}`
                    }))
                ]
            });
        }
        const songs = [
            ...ctx.guild.queue.songs.sortByIndex().values()
        ];
        if (![
            "first",
            "last"
        ].includes(String(targetType).toLowerCase()) && !isNaN(Number(targetType)) && !songs[Number(targetType) - 1]) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.skipTo.noSongPosition"), true)
                ]
            });
        }
        let song;
        if (String(targetType).toLowerCase() === "first") {
            song = songs[0];
        } else if (String(targetType).toLowerCase() === "last") {
            song = songs[songs.length - 1];
        } else {
            song = songs[Number(targetType) - 1];
        }
        if (song.key === ctx.guild.queue.player.state.resource.metadata.key) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.skipTo.cantPlay"), true)
                ]
            });
        }
        void play(ctx.guild, song.key);
        return ctx.reply({
            embeds: [
                createEmbed("success", `⏭ **|** ${i18n.__mf("commands.music.skipTo.skipMessage", {
                    song: `[${song.song.title}](${song.song.url})`
                })}`).setThumbnail(song.song.thumbnail)
            ]
        });
    }
};
__decorate([
    inVC,
    haveQueue,
    sameVC
], SkipToCommand.prototype, "execute", null);
SkipToCommand = __decorate([
    Command({
        aliases: [
            "st"
        ],
        description: i18n.__("commands.music.skipTo.description"),
        name: "skipto",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.skipTo.slashFirstDescription"),
                    name: "first",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__("commands.music.skipTo.slashLastDescription"),
                    name: "last",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__("commands.music.skipTo.slashSpecificDescription"),
                    name: "specific",
                    options: [
                        {
                            description: i18n.__("commands.music.skipTo.slashPositionDescription"),
                            name: "position",
                            required: true,
                            type: ApplicationCommandOptionType.Number
                        }
                    ],
                    type: ApplicationCommandOptionType.Subcommand
                }
            ]
        },
        usage: i18n.__mf("commands.music.skipTo.usage", {
            options: "first | last"
        })
    })
], SkipToCommand);
