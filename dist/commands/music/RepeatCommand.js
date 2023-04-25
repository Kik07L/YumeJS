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
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let RepeatCommand = class RepeatCommand extends BaseCommand {
    execute(ctx) {
        const mode = {
            OFF: {
                aliases: [
                    "disable",
                    "off",
                    "0"
                ],
                emoji: "▶"
            },
            QUEUE: {
                aliases: [
                    "all",
                    "queue"
                ],
                emoji: "🔁"
            },
            SONG: {
                aliases: [
                    "one",
                    "song",
                    "current",
                    "this",
                    "1"
                ],
                emoji: "🔂"
            }
        };
        const selection = ctx.options?.getSubcommand() || ctx.args[0] ? Object.keys(mode).find((key)=>mode[key].aliases.includes(ctx.args[0] ?? ctx.options.getSubcommand())) : undefined;
        if (!selection) {
            return ctx.reply({
                embeds: [
                    createEmbed("info", `${mode[ctx.guild.queue.loopMode].emoji} **|** ${i18n.__mf("commands.music.repeat.actualMode", {
                        mode: `\`${ctx.guild.queue.loopMode}\``
                    })}`).setFooter({
                        text: i18n.__mf("commands.music.repeat.footer", {
                            prefix: this.client.config.mainPrefix
                        })
                    })
                ]
            });
        }
        ctx.guild.queue.loopMode = selection;
        return ctx.reply({
            embeds: [
                createEmbed("success", `${mode[ctx.guild.queue.loopMode].emoji} **|** ${i18n.__mf("commands.music.repeat.newMode", {
                    mode: `\`${ctx.guild.queue.loopMode}\``
                })}`)
            ]
        });
    }
};
__decorate([
    inVC,
    haveQueue,
    sameVC
], RepeatCommand.prototype, "execute", null);
RepeatCommand = __decorate([
    Command({
        aliases: [
            "loop",
            "music-repeat",
            "music-loop"
        ],
        description: i18n.__("commands.music.repeat.description"),
        name: "repeat",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.repeat.slashQueue"),
                    name: "queue",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__("commands.music.repeat.slashQueue"),
                    name: "song",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__("commands.music.repeat.slashDisable"),
                    name: "disable",
                    type: ApplicationCommandOptionType.Subcommand
                }
            ]
        },
        usage: i18n.__mf("commands.music.repeat.usage", {
            options: "queue | one | disable"
        })
    })
], RepeatCommand);
