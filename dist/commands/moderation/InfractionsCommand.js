var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ButtonPagination } from "../../utils/structures/ButtonPagination";
import { memberReqPerms } from "../../utils/decorators/CommonUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { formatTime } from "../../utils/functions/formatMS";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import { chunk } from "../../utils/functions/chunk";
import i18n from "../../config";
import { ApplicationCommandOptionType } from "discord.js";
export let InfractionsCommand = class InfractionsCommand extends BaseCommand {
    async execute(ctx) {
        const user = ctx.guild?.members.resolve(ctx.args.shift()?.replace(/[^0-9]/g, "") ?? "")?.user ?? ctx.options?.getUser("member", false) ?? ctx.author;
        const embed = createEmbed("info").setAuthor({
            name: i18n.__mf("commands.moderation.infractions.embedAuthorText", {
                user: user.tag
            })
        });
        let infractions;
        try {
            infractions = this.client.data.data[ctx.guild.id].infractions[user.id];
            if (!infractions) throw new Error();
        } catch  {
            infractions = [];
        }
        if (!infractions.length) {
            await ctx.reply({
                embeds: [
                    embed.setDescription(i18n.__("commands.moderation.infractions.noInfractions"))
                ]
            });
            return;
        }
        const pages = await Promise.all(chunk(infractions, 10).map(async (s, n)=>{
            const infracts = await Promise.all(s.map((inf, i)=>`${n * 10 + (i + 1)}. ${formatTime(inf.on)} - ${inf.reason ?? i18n.__("commands.moderation.common.noReasonString")}`));
            return infracts.join("\n");
        }));
        const msg = await ctx.reply({
            embeds: [
                embed.setDescription(pages[0]).setFooter({
                    text: i18n.__mf("reusable.pageFooter", {
                        actual: 1,
                        total: pages.length
                    })
                })
            ]
        });
        return new ButtonPagination(msg, {
            author: ctx.author.id,
            edit: (i, e, p)=>e.setDescription(p).setFooter({
                    text: i18n.__mf("reusable.pageFooter", {
                        actual: i + 1,
                        total: pages.length
                    })
                }),
            embed,
            pages
        }).start();
    }
};
__decorate([
    memberReqPerms([
        "ManageGuild"
    ], i18n.__("commands.moderation.warn.userNoPermission"))
], InfractionsCommand.prototype, "execute", null);
InfractionsCommand = __decorate([
    Command({
        contextUser: "Show user infractions",
        description: i18n.__("commands.moderation.infractions.description"),
        name: "infractions",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.infractions.slashMemberDescription"),
                    name: "member",
                    required: false,
                    type: ApplicationCommandOptionType.User
                }
            ]
        },
        usage: i18n.__("commands.moderation.infractions.usage")
    })
], InfractionsCommand);
