var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createProgressBar } from "../../utils/functions/createProgressBar";
import { normalizeTime } from "../../utils/functions/normalizeTime";
import { CommandContext } from "../../structures/CommandContext";
import { createEmbed } from "../../utils/functions/createEmbed";
import { haveQueue } from "../../utils/decorators/MusicUtil";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
export let NowPlayingCommand = class NowPlayingCommand extends BaseCommand {
    async execute(ctx) {
        function getEmbed() {
            const res = ctx.guild?.queue?.player.state?.resource;
            const song = (res?.metadata)?.song;
            const embed = createEmbed("info", `${ctx.guild?.queue?.playing ? "▶" : "⏸"} **|** `).setThumbnail(song?.thumbnail ?? "https://api.clytage.org/assets/images/icon.png");
            const curr = ~~(res.playbackDuration / 1000);
            embed.data.description += song ? `**[${song.title}](${song.url})**\n` + `${normalizeTime(curr)} ${createProgressBar(curr, song.duration)} ${normalizeTime(song.duration)}` : i18n.__("commands.music.nowplaying.emptyQueue");
            return embed;
        }
        const buttons = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("TOGGLE_STATE_BUTTON").setLabel("Pause/Resume").setStyle(ButtonStyle.Primary).setEmoji("⏯️"), new ButtonBuilder().setCustomId("SKIP_BUTTON").setLabel("Skip").setStyle(ButtonStyle.Secondary).setEmoji("⏭"), new ButtonBuilder().setCustomId("STOP_BUTTON").setLabel("Stop Player").setStyle(ButtonStyle.Danger).setEmoji("⏹"), new ButtonBuilder().setCustomId("SHOW_QUEUE_BUTTON").setLabel("Show Queue").setStyle(ButtonStyle.Secondary).setEmoji("#️⃣"));
        const msg = await ctx.reply({
            embeds: [
                getEmbed()
            ],
            components: [
                buttons
            ]
        });
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i)=>i.isButton() && i.user.id === ctx.author.id,
            idle: 30000
        });
        collector.on("collect", async (i)=>{
            const newCtx = new CommandContext(i);
            let cmdName = "";
            switch(i.customId){
                case "TOGGLE_STATE_BUTTON":
                    {
                        cmdName = ctx.guild?.queue?.playing ? "pause" : "resume";
                        break;
                    }
                case "SKIP_BUTTON":
                    {
                        cmdName = "skip";
                        break;
                    }
                case "SHOW_QUEUE_BUTTON":
                    {
                        cmdName = "queue";
                        break;
                    }
                case "STOP_BUTTON":
                    {
                        cmdName = "stop";
                        break;
                    }
            }
            await this.client.commands.get(cmdName)?.execute(newCtx);
            const embed = getEmbed();
            await msg.edit({
                embeds: [
                    embed
                ]
            });
        }).on("end", ()=>{
            const embed = getEmbed().setFooter({
                text: i18n.__("commands.music.nowplaying.disableButton")
            });
            void msg.edit({
                embeds: [
                    embed
                ],
                components: []
            });
        });
    }
};
__decorate([
    haveQueue
], NowPlayingCommand.prototype, "execute", null);
NowPlayingCommand = __decorate([
    Command({
        aliases: [
            "np"
        ],
        description: i18n.__("commands.music.nowplaying.description"),
        name: "nowplaying",
        slash: {
            options: []
        },
        usage: "{prefix}nowplaying"
    })
], NowPlayingCommand);
