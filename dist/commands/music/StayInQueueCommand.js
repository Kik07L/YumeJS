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
export let StayInQueueCommand = class StayInQueueCommand extends BaseCommand {
    execute(ctx) {
        if (!this.client.config.is247Allowed) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.stayInQueue.247Disabled"), true)
                ]
            });
        }
        const newState = ctx.options?.getString("state") ?? ctx.args[0];
        if (!newState) {
            return ctx.reply({
                embeds: [
                    createEmbed("info", `🔊 **|** ${i18n.__mf("commands.music.stayInQueue.actualState", {
                        state: `\`${ctx.guild?.queue?.stayInVC ? "ENABLED" : "DISABLED"}\``
                    })}`)
                ]
            });
        }
        ctx.guild.queue.stayInVC = newState === "enable";
        return ctx.reply({
            embeds: [
                createEmbed("success", `🔊 **|** ${i18n.__mf("commands.music.stayInQueue.newState", {
                    state: `\`${ctx.guild?.queue?.stayInVC ? "ENABLED" : "DISABLED"}\``
                })}`, true)
            ]
        });
    }
};
__decorate([
    inVC,
    haveQueue,
    sameVC
], StayInQueueCommand.prototype, "execute", null);
StayInQueueCommand = __decorate([
    Command({
        aliases: [
            "stayinvc",
            "stay",
            "24/7"
        ],
        description: i18n.__("commands.music.stayInQueue.description"),
        name: "stayinvoice",
        slash: {
            options: [
                {
                    choices: [
                        {
                            name: "ENABLE",
                            value: "enable"
                        },
                        {
                            name: "DISABLE",
                            value: "disable"
                        }
                    ],
                    description: i18n.__("commands.music.stayInQueue.slashDescription"),
                    name: "state",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: "{prefix}stayinvc [enable | disable]"
    })
], StayInQueueCommand);
