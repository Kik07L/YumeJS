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
export let MuteCommand = class MuteCommand extends BaseCommand {
    async execute(ctx) {
        if (!ctx.guild) return;
        const memberId = ctx.args.shift()?.replace(/[^0-9]/g, "") ?? ctx.options?.getUser("user")?.id ?? ctx.options?.getUser("member")?.id;
        const member = ctx.guild.members.resolve(memberId);
        if (!member) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.common.noUserSpecified"))
                ]
            });
        }
        if (ctx.guild.ownerId === member.id) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.moderation.mute.cantMuteOwner"), true)
                ]
            });
        }
        const muteRole = await this.client.utils.fetchMuteRole(ctx.guild);
        if (!muteRole) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("commands.moderation.mute.noRole", {
                        prefix: this.client.config.mainPrefix
                    }))
                ]
            });
        }
        if (member.roles.cache.has(muteRole.id)) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.moderation.mute.alreadyMuted"), true)
                ]
            });
        }
        const reason = ctx.options?.getString("reason") ?? (ctx.args.join(" ") || i18n.__("commands.moderation.common.noReasonString"));
        const mute = await member.roles.add(muteRole, reason).catch((err)=>new Error(err));
        if (mute instanceof Error) return ctx.reply({
            embeds: [
                createEmbed("error", i18n.__mf("commands.moderation.mute.muteFail", {
                    message: mute.message
                }), true)
            ]
        });
        const dm = await member.user.createDM().catch(()=>undefined);
        if (dm) {
            await dm.send({
                embeds: [
                    createEmbed("error", i18n.__mf("commands.moderation.mute.userMuted", {
                        guildName: ctx.guild.name
                    })).setColor("LightGrey").setThumbnail(ctx.guild.iconURL({
                        extension: "png",
                        size: 1024
                    })).addFields([
                        {
                            name: i18n.__("commands.moderation.common.reasonString"),
                            value: reason
                        }
                    ]).setFooter({
                        text: i18n.__mf("commands.moderation.mute.mutedByString", {
                            author: ctx.author.tag
                        }),
                        iconURL: ctx.author.displayAvatarURL({})
                    }).setTimestamp(Date.now())
                ]
            });
        }
        return ctx.reply({
            embeds: [
                createEmbed("success", i18n.__mf("commands.moderation.mute.muteSuccess", {
                    user: member.user.tag
                }), true)
            ]
        });
    }
};
__decorate([
    memberReqPerms([
        "ManageRoles"
    ], i18n.__("commands.moderation.mute.userNoPermission")),
    botReqPerms([
        "ManageRoles"
    ], i18n.__("commands.moderation.mute.botNoPermission"))
], MuteCommand.prototype, "execute", null);
MuteCommand = __decorate([
    Command({
        contextUser: "Mute Member",
        description: i18n.__("commands.moderation.mute.description"),
        name: "mute",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.mute.slashMemberDescription"),
                    name: "member",
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    description: i18n.__("commands.moderation.mute.slashReasonDescription"),
                    name: "reason",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.moderation.mute.usage")
    })
], MuteCommand);
