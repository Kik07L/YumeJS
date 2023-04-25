var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEmbed } from "../../utils/functions/createEmbed";
import { createTable } from "../../utils/functions/createTable";
import { BaseCommand } from "../../structures/BaseCommand";
import { formatMS } from "../../utils/functions/formatMS";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { version as DJSVersion } from "discord.js";
import { readFileSync } from "node:fs";
import { uptime } from "node:os";
const pkg = JSON.parse(readFileSync(new URL("../../../package.json", import.meta.url)).toString());
export let AboutCommand = class AboutCommand extends BaseCommand {
    async execute(ctx) {
        const values = [
            [
                i18n.__("commands.general.about.osUptimeString"),
                formatMS(uptime() * 1000)
            ],
            [
                i18n.__("commands.general.about.processUptimeString"),
                formatMS(process.uptime() * 1000)
            ],
            [
                i18n.__("commands.general.about.botUptimeString"),
                formatMS(process.uptime() * 1000)
            ],
            [
                ""
            ],
            [
                i18n.__("commands.general.about.cachedUsersString"),
                `${await this.client.utils.getUserCount()}`
            ],
            [
                i18n.__("commands.general.about.channelsString"),
                `${await this.client.utils.getChannelCount()}`
            ],
            [
                i18n.__("commands.general.about.serversString"),
                `${await this.client.utils.getGuildCount()}`
            ],
            [
                ""
            ],
            [
                i18n.__("commands.general.about.nodeVersionString"),
                process.versions.node
            ],
            [
                i18n.__("commands.general.about.discordJSVersionString"),
                DJSVersion
            ],
            [
                i18n.__("commands.general.about.ffmpegVersionString"),
                this.client.utils.getFFmpegVersion()
            ],
            [
                i18n.__("commands.general.about.botVersionString"),
                pkg.version
            ],
            [
                i18n.__("commands.general.about.commitString"),
                this.client.utils.getCommitHash("HEAD")
            ],
            [
                ""
            ],
            [
                i18n.__("commands.general.about.sourceCodeString"),
                "https://github.com/Clytage/rawon"
            ]
        ];
        const value = createTable(values);
        void ctx.reply({
            embeds: [
                createEmbed("info", `\`\`\`asciidoc\n${value}\n\`\`\``).setAuthor({
                    name: i18n.__mf("commands.general.about.aboutFooter", {
                        botname: this.client.user?.username ?? "Unknown"
                    })
                })
            ]
        }).catch((e)=>this.client.logger.error("ABOUT_CMD_ERR:", e));
    }
};
AboutCommand = __decorate([
    Command({
        aliases: [
            "information",
            "info",
            "botinfo",
            "stats"
        ],
        description: i18n.__("commands.general.about.description"),
        name: "about",
        slash: {
            options: []
        },
        usage: "{prefix}about"
    })
], AboutCommand);
