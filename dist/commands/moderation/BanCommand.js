var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { botReqPerms, memberReqPerms } from "../../utils/decorators/CommonUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let BanCommand = class BanCommand extends BaseCommand {
    async execute(ctx) {
        if (!ctx.guild) return;
        const memberId = ctx.args.shift()?.replace(/[^0-9]/g, "") ?? ctx.options?.getUser("user")?.id ?? ctx.options?.getString("memberid");
        const user = await this.client.users.fetch(memberId, {
            force: false
        }).catch(()=>undefined);
        const resolved = ctx.guild.members.resolve(user);
        if (!user) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.common.noUserSpecified"))
                ]
            });
        }
        if (!resolved?.bannable) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.ban.userNoBannable"), true)
                ]
            });
        }
        const reason = ctx.options?.getString("reason") ?? (ctx.args.join(" ") || i18n.__("commands.moderation.common.noReasonString"));
        if (ctx.guild.members.cache.has(user.id)) {
            const dm = await user.createDM().catch(()=>undefined);
            if (dm) {
                await dm.send({
                    embeds: [
                        createEmbed("error", i18n.__mf("commands.moderation.ban.userBanned", {
                            guildName: ctx.guild.name
                        })).setThumbnail(ctx.guild.iconURL({
                            extension: "png",
                            size: 1024
                        })).addFields([
                            {
                                name: i18n.__("commands.moderation.common.reasonString"),
                                value: reason
                            }
                        ]).setFooter({
                            text: i18n.__mf("commands.moderation.ban.bannedByString", {
                                author: ctx.author.tag
                            }),
                            iconURL: ctx.author.displayAvatarURL({})
                        }).setTimestamp(Date.now())
                    ]
                });
            }
        }
        const ban = await ctx.guild.members.ban(user, {
            reason
        }).catch((err)=>new Error(err));
        if (ban instanceof Error) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__mf("commands.moderation.ban.banFail", {
                        message: ban.message
                    }), true)
                ]
            });
        }
        return ctx.reply({
            embeds: [
                createEmbed("success", i18n.__mf("commands.moderation.ban.banSuccess", {
                    user: user.tag
                }), true)
            ]
        });
    }
};
__decorate([
    memberReqPerms([
        "BanMembers"
    ], i18n.__("commands.moderation.ban.userNoPermission")),
    botReqPerms([
        "BanMembers"
    ], i18n.__("commands.moderation.ban.botNoPermission"))
], BanCommand.prototype, "execute", null);
BanCommand = __decorate([
    Command({
        contextUser: "Ban Member",
        description: i18n.__("commands.moderation.ban.description"),
        name: "ban",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.ban.slashMemberIDDescription"),
                    name: "memberid",
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: i18n.__("commands.moderation.ban.slashReasonDescription"),
                    name: "reason",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.moderation.ban.usage")
    })
], BanCommand);
