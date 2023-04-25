/* eslint-disable no-nested-ternary */ var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ButtonPagination } from "../../utils/structures/ButtonPagination";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import { chunk } from "../../utils/functions/chunk";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let LyricsCommand = class LyricsCommand extends BaseCommand {
    execute(ctx) {
        const query = ctx.args.length >= 1 ? ctx.args.join(" ") : ctx.options?.getString("query") ? ctx.options.getString("query") : (ctx.guild?.queue?.player.state.resource?.metadata)?.song.title;
        if (!query) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.lyrics.noQuery"), true)
                ]
            });
        }
        this.getLyrics(ctx, query);
    }
    getLyrics(ctx, song) {
        const url = `https://api.lxndr.dev/lyrics?song=${encodeURI(song)}&from=DiscordRawon`;
        this.client.request.get(url).json().then(async (data)=>{
            if (data.error) {
                return ctx.reply({
                    embeds: [
                        createEmbed("error", i18n.__mf("commands.music.lyrics.apiError", {
                            song: `\`${song}\``,
                            message: `\`${data.message}\``
                        }), true)
                    ]
                });
            }
            const albumArt = data.album_art ?? "https://api.clytage.org/assets/images/icon.png";
            const pages = chunk(data.lyrics, 2048);
            const embed = createEmbed("info", pages[0]).setAuthor({
                name: data.song && data.artist ? `${data.song} - ${data.artist}` : song.toUpperCase()
            }).setThumbnail(albumArt);
            const msg = await ctx.reply({
                embeds: [
                    embed
                ]
            });
            return new ButtonPagination(msg, {
                author: ctx.author.id,
                edit: (i, e, p)=>e.setDescription(p).setFooter({
                        text: i18n.__mf("reusable.pageFooter", {
                            actual: i + 1,
                            total: pages.length
                        })
                    }),
                embed,
                pages
            }).start();
        }).catch((error)=>console.error(error));
    }
};
LyricsCommand = __decorate([
    Command({
        aliases: [
            "ly",
            "lyric"
        ],
        description: i18n.__("commands.music.lyrics.description"),
        name: "lyrics",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.lyrics.slashDescription"),
                    name: "query",
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        usage: i18n.__("commands.music.lyrics.usage")
    })
], LyricsCommand);
