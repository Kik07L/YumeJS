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
export let UnBanCommand = class UnBanCommand extends BaseCommand {
    async execute(ctx) {
        if (!ctx.guild) return;
        const memberId = ctx.args.shift()?.replace(/[^0-9]/g, "") ?? ctx.options?.getUser("user")?.id ?? ctx.options?.getString("memberid");
        const user = await this.client.users.fetch(memberId, {
            force: false
        }).catch(()=>undefined);
        const resolved = ctx.guild.bans.resolve(user?.id ?? "");
        if (!user) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.common.noUserSpecified"))
                ]
            });
        }
        if (!resolved) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.moderation.unban.alreadyUnban"), true)
                ]
            });
        }
        const unban = await ctx.guild.bans.remove(user.id, ctx.options?.getString("reason") ?? (ctx.args.length ? ctx.args.join(" ") : i18n.__("commands.moderation.common.noReasonString"))).catch((err)=>new Error(err));
        if (unban instanceof Error) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__mf("commands.moderation.unban.unbanFail", {
                        message: unban.message
                    }), true)
                ]
            });
        }
        return ctx.reply({
            embeds: [
                createEmbed("success", i18n.__mf("commands.moderation.unban.unbanSuccess", {
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
], UnBanCommand.prototype, "execute", null);
UnBanCommand = __decorate([
    Command({
        description: i18n.__("commands.moderation.unban.description"),
        name: "unban",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.unban.slashMemberDescription"),
                    name: "memberid",
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: i18n.__("commands.moderation.unban.slashReasonDescription"),
                    name: "reason",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.moderation.unban.usage")
    })
], UnBanCommand);
