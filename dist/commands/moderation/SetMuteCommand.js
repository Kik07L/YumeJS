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
import { ApplicationCommandOptionType } from "discord.js";
export let SetMuteCommand = class SetMuteCommand extends BaseCommand {
    async execute(ctx) {
        const id = ctx.options?.getRole("role", true).id ?? ctx.args[0].replace(/\D/g, "");
        if (!id) {
            await ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.moderation.setmute.invalidRole"))
                ]
            });
            return;
        }
        const role = await ctx.guild?.roles.fetch(id).catch(()=>undefined);
        if (!role) {
            await ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.moderation.setmute.invalidRole"))
                ]
            });
            return;
        }
        await this.client.data.save(()=>{
            const data = this.client.data.data;
            const guildData = data?.[ctx.guild?.id ?? ""];
            return {
                ...data ?? {},
                [ctx.guild.id]: {
                    ...guildData ?? {},
                    infractions: guildData?.infractions ?? {},
                    mute: role.id
                }
            };
        });
        await ctx.reply({
            embeds: [
                createEmbed("success", i18n.__mf("commands.moderation.setmute.success", {
                    role: role.id
                }))
            ]
        });
    }
};
SetMuteCommand = __decorate([
    Command({
        aliases: [
            "setmuterole"
        ],
        description: i18n.__("commands.moderation.setmute.description"),
        name: "setmute",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.setmute.slashRoleDescription"),
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        usage: i18n.__("commands.moderation.setmute.usage")
    })
], SetMuteCommand);
