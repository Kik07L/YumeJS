var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { memberReqPerms } from "../../utils/decorators/CommonUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let WarnCommand = class WarnCommand extends BaseCommand {
    async execute(ctx) {
        const member = ctx.guild?.members.resolve(ctx.args.shift()?.replace(/[^0-9]/g, "") ?? "")?.user ?? ctx.options?.getUser("member", true);
        if (!member) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.common.noUserSpecified"))
                ]
            });
        }
        const dm = await member.createDM().catch(()=>undefined);
        if (!dm) {
            await ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.warn.noDM"))
                ]
            });
        }
        const time = Date.now();
        const reason = ctx.options?.getString("reason") ?? (ctx.args.join(" ") || null);
        const displayReason = reason ?? i18n.__("commands.moderation.common.noReasonString");
        const embed = createEmbed("warn", i18n.__mf("commands.moderation.warn.userWarned", {
            guildName: ctx.guild.name
        })).setThumbnail(ctx.guild.iconURL({
            extension: "png",
            size: 1024
        })).addFields([
            {
                name: i18n.__("commands.moderation.common.reasonString"),
                value: displayReason
            }
        ]).setFooter({
            text: i18n.__mf("commands.moderation.warn.warnedByString", {
                author: ctx.author.tag
            }),
            iconURL: ctx.author.displayAvatarURL({})
        }).setTimestamp(time);
        await dm?.send({
            embeds: [
                embed
            ]
        });
        await this.client.data.save(()=>{
            const prefGuildData = this.client.data.data?.[ctx.guild.id];
            const newData = {
                ...this.client.data.data ?? {},
                [ctx.guild.id]: {
                    infractions: {
                        ...prefGuildData?.infractions ?? {},
                        [member.id]: [
                            ...prefGuildData?.infractions[member.id] ?? [],
                            {
                                on: time,
                                reason
                            }
                        ]
                    },
                    modLog: prefGuildData?.modLog ?? {
                        enable: false,
                        channel: null
                    }
                }
            };
            return newData;
        });
        void this.client.modlogs.handleWarn({
            author: ctx.author,
            guild: ctx.guild,
            reason,
            user: member
        }).catch(()=>null);
        return ctx.reply({
            embeds: [
                createEmbed("success", i18n.__mf("commands.moderation.warn.warnSuccess", {
                    user: member.tag
                }), true)
            ]
        });
    }
};
__decorate([
    memberReqPerms([
        "ManageGuild"
    ], i18n.__("commands.moderation.warn.userNoPermission"))
], WarnCommand.prototype, "execute", null);
WarnCommand = __decorate([
    Command({
        description: i18n.__("commands.moderation.warn.description"),
        name: "warn",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.warn.slashMemberDescription"),
                    name: "member",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    description: i18n.__("commands.moderation.warn.slashReasonDescription"),
                    name: "reason",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.moderation.warn.usage")
    })
], WarnCommand);
