function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import { createEmbed } from "../functions/createEmbed";
import i18n from "../../config";
import { ChannelType } from "discord.js";
export class ModerationLogs {
    async handleWarn(options) {
        const ch = await this.getCh(options.guild);
        if (!ch) return;
        const embed = createEmbed("warn", i18n.__mf("commands.moderation.warn.warnSuccess", {
            user: options.user.tag
        })).setThumbnail(options.user.displayAvatarURL({
            size: 1024
        })).addFields([
            {
                name: i18n.__("commands.moderation.common.reasonString"),
                value: options.reason ?? i18n.__("commands.moderation.common.noReasonString")
            }
        ]).setFooter({
            text: i18n.__mf("commands.moderation.warn.warnedByString", {
                author: options.author.tag
            }),
            iconURL: options.author.displayAvatarURL({})
        });
        await ch.send({
            embeds: [
                embed
            ]
        }).catch((er)=>console.log(`Failed to send warn logs: ${er.message}`));
    }
    async handleBanAdd(options) {
        const fetched = await options.ban.fetch().catch(()=>undefined);
        if (!fetched) return;
        const ch = await this.getCh(fetched.guild);
        if (!ch) return;
        const embed = createEmbed("error", i18n.__mf("commands.moderation.ban.banSuccess", {
            user: fetched.user.tag
        })).setThumbnail(fetched.user.displayAvatarURL({
            size: 1024
        })).addFields([
            {
                name: i18n.__("commands.moderation.common.reasonString"),
                value: fetched.reason ?? i18n.__("commands.moderation.common.noReasonString")
            }
        ]);
        if (options.author) {
            embed.setFooter({
                text: i18n.__mf("commands.moderation.ban.bannedByString", {
                    author: options.author.tag
                }),
                iconURL: options.author.displayAvatarURL({})
            });
        }
        await ch.send({
            embeds: [
                embed
            ]
        });
    }
    async handleBanRemove(options) {
        const ch = await this.getCh(options.ban.guild);
        if (!ch) return;
        const embed = createEmbed("info", i18n.__mf("commands.moderation.unban.unbanSuccess", {
            user: options.ban.user.tag
        })).setThumbnail(options.ban.user.displayAvatarURL({
            size: 1024
        })).addFields([
            {
                name: i18n.__("commands.moderation.common.reasonString"),
                value: options.ban.reason ?? i18n.__("commands.moderation.common.noReasonString")
            }
        ]);
        if (options.author) {
            embed.setFooter({
                text: i18n.__mf("commands.moderation.unban.unbannedByString", {
                    author: options.author.tag
                }),
                iconURL: options.author.displayAvatarURL({})
            });
        }
        await ch.send({
            embeds: [
                embed
            ]
        });
    }
    async getCh(guild) {
        let ch;
        try {
            // Temporary solution for mod-logs checking.
            const modlog = this.client.data.data[guild.id].modLog;
            if (!modlog?.enable) throw new Error();
            const id = modlog.channel;
            const channel = await guild.channels.fetch(id).catch(()=>undefined);
            if (channel?.type !== ChannelType.GuildText) throw new Error();
            ch = channel;
        } catch  {
            ch = undefined;
        }
        return ch;
    }
    constructor(client){
        _define_property(this, "client", void 0);
        this.client = client;
    }
}
