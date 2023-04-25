var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import { filterArgs } from "../../utils/functions/ffmpegArgs";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
const slashFilterChoices = Object.keys(filterArgs).map((x)=>({
        name: x,
        value: x
    }));
export let FilterCommand = class FilterCommand extends BaseCommand {
    execute(ctx) {
        const mode = {
            on: "enable",
            off: "disable",
            enable: "enable",
            disable: "disable",
            stats: "status",
            status: "status"
        };
        const subcmd = mode[(ctx.options?.getSubcommand() ?? ctx.args[0])?.toLowerCase()];
        const filter = (ctx.options?.getString("filter") ?? ctx.args[subcmd ? 1 : 0])?.toLowerCase();
        if (subcmd === "enable" || subcmd === "disable") {
            if (!filterArgs[filter]) {
                return ctx.reply({
                    embeds: [
                        createEmbed("error", i18n.__("commands.music.filter.specifyFilter"))
                    ]
                });
            }
            ctx.guild?.queue?.setFilter(filter, subcmd === "enable");
            return ctx.reply({
                embeds: [
                    createEmbed("info", i18n.__mf("commands.music.filter.filterSet", {
                        filter,
                        state: subcmd === "enable" ? "ENABLED" : "DISABLED"
                    }))
                ]
            });
        }
        if (filterArgs[filter]) {
            return ctx.reply({
                embeds: [
                    createEmbed("info", i18n.__mf("commands.music.filter.currentState", {
                        filter,
                        state: ctx.guild?.queue?.filters[filter] ? "ENABLED" : "DISABLED"
                    })).setFooter({
                        text: i18n.__mf("commands.music.filter.embedFooter", {
                            filter,
                            opstate: ctx.guild?.queue?.filters[filter] ? "disable" : "enable",
                            prefix: ctx.isCommand() ? "/" : this.client.config.mainPrefix
                        })
                    })
                ]
            });
        }
        const keys = Object.keys(filterArgs);
        return ctx.reply({
            embeds: [
                createEmbed("info").addFields({
                    name: i18n.__("commands.music.filter.availableFilters"),
                    value: keys.filter((x)=>!ctx.guild?.queue?.filters[x]).map((x)=>`\`${x}\``).join("\n") || "-",
                    inline: true
                }, {
                    name: i18n.__("commands.music.filter.currentlyUsedFilters"),
                    value: keys.filter((x)=>ctx.guild?.queue?.filters[x]).map((x)=>`\`${x}\``).join("\n") || "-",
                    inline: true
                })
            ]
        });
    }
};
__decorate([
    inVC,
    validVC,
    sameVC
], FilterCommand.prototype, "execute", null);
FilterCommand = __decorate([
    Command({
        aliases: [],
        description: i18n.__("commands.music.filter.description"),
        name: "filter",
        slash: {
            options: [
                {
                    description: i18n.__mf("commands.music.filter.slashStateDescription", {
                        state: "enable"
                    }),
                    name: "enable",
                    options: [
                        {
                            choices: slashFilterChoices,
                            description: i18n.__mf("commands.music.filter.slashStateFilterDescription", {
                                state: "enable"
                            }),
                            name: "filter",
                            required: true,
                            type: ApplicationCommandOptionType.String
                        }
                    ],
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__mf("commands.music.filter.slashStateDescription", {
                        state: "disable"
                    }),
                    name: "disable",
                    options: [
                        {
                            choices: slashFilterChoices,
                            description: i18n.__("commands.music.filter.slashStateFilterDescription", {
                                state: "disable"
                            }),
                            name: "filter",
                            required: true,
                            type: ApplicationCommandOptionType.String
                        }
                    ],
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    description: i18n.__("commands.music.filter.slashStatusDescription"),
                    name: "status",
                    options: [
                        {
                            choices: slashFilterChoices,
                            description: i18n.__("commands.music.filter.slashStatusFilterDescription"),
                            name: "filter",
                            required: false,
                            type: ApplicationCommandOptionType.String
                        }
                    ],
                    type: ApplicationCommandOptionType.Subcommand
                }
            ]
        },
        usage: "{prefix}filter"
    })
], FilterCommand);
