var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { OAuth2Scopes, PermissionFlagsBits } from "discord.js";
export let InviteCommand = class InviteCommand extends BaseCommand {
    async execute(ctx) {
        const invite = this.client.generateInvite({
            permissions: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.CreatePublicThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.PrioritySpeaker,
                PermissionFlagsBits.ReadMessageHistory
            ],
            scopes: [
                OAuth2Scopes.Bot,
                OAuth2Scopes.ApplicationsCommands
            ]
        });
        await ctx.send({
            embeds: [
                createEmbed("info", i18n.__mf("commands.general.invite.clickURL", {
                    url: invite
                })).setAuthor({
                    name: i18n.__mf("commands.general.invite.inviteTitle", {
                        bot: this.client.user?.username
                    }),
                    iconURL: this.client.user.displayAvatarURL()
                })
            ]
        }).catch((e)=>this.client.logger.error("PLAY_CMD_ERR:", e));
    }
};
InviteCommand = __decorate([
    Command({
        aliases: [
            "inv"
        ],
        description: i18n.__("commands.general.invite.description"),
        name: "invite",
        slash: {
            options: []
        },
        usage: "{prefix}invite"
    })
], InviteCommand);
