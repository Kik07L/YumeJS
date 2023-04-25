var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { parseHTMLElements } from "../../utils/functions/parseHTMLElements";
import { checkQuery, searchTrack } from "../../utils/handlers/GeneralUtil";
import { inVC, validVC, sameVC } from "../../utils/decorators/MusicUtil";
import { CommandContext } from "../../structures/CommandContext";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType, ComponentType, escapeMarkdown } from "discord.js";
export let SearchCommand = class SearchCommand extends BaseCommand {
    async execute(ctx) {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        const values = ctx.additionalArgs.get("values");
        if (values && ctx.isStringSelectMenu()) {
            if (!ctx.deferred) await ctx.deferReply();
            const newCtx = new CommandContext(ctx.context, []);
            newCtx.additionalArgs.set("values", values);
            newCtx.additionalArgs.set("fromSearch", true);
            this.client.commands.get("play").execute(newCtx);
            const msg = await ctx.channel.messages.fetch(ctx.context.message.id).catch(()=>undefined);
            if (msg !== undefined) {
                const selection = msg.components[0].components.find((x)=>x.type === ComponentType.StringSelect);
                if (!selection) return;
                const disabledMenu = new StringSelectMenuBuilder().setDisabled(true).setCustomId(selection.customId).addOptions({
                    label: "Nothing to select here",
                    description: "Nothing to select here",
                    value: "Nothing to select here"
                });
                await msg.edit({
                    components: [
                        new ActionRowBuilder().addComponents(disabledMenu)
                    ]
                });
            }
            return;
        }
        const source = ctx.options?.getString("source") ?? ([
            "youtube",
            "soundcloud"
        ].includes(ctx.args.slice(-1)[0]?.toLowerCase()) ? ctx.args.pop() : "youtube");
        const query = (ctx.args.join(" ") || ctx.options?.getString("query")) ?? ctx.options?.getMessage("message")?.content;
        if (!query) {
            return ctx.send({
                embeds: [
                    createEmbed("warn", i18n.__("commands.music.search.noQuery"))
                ]
            });
        }
        if (checkQuery(query).isURL) {
            const newCtx = new CommandContext(ctx.context, [
                String(query)
            ]);
            return this.client.commands.get("play").execute(newCtx);
        }
        const tracks = await searchTrack(this.client, query, source).then((x)=>({
                items: x.items.slice(0, 10),
                type: x.type
            })).catch(()=>undefined);
        if (!tracks || tracks.items.length <= 0) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.search.noTracks"), true)
                ]
            });
        }
        if (this.client.config.musicSelectionType === "selectmenu") {
            return ctx.send({
                content: i18n.__("commands.music.search.interactionContent"),
                components: [
                    new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setMinValues(1).setMaxValues(10).setCustomId(Buffer.from(`${ctx.author.id}_${this.meta.name}`).toString("base64")).addOptions(this.generateSelectMenu(tracks.items)).setPlaceholder(i18n.__("commands.music.search.interactionPlaceholder")))
                ]
            });
        }
        const msg = await ctx.send({
            embeds: [
                createEmbed("info", `${i18n.__mf("commands.music.search.queueEmbed", {
                    separator: "`,`",
                    example: "`1, 2, 3`"
                })}\`\`\`\n${tracks.items.map((x, i)=>`${i + 1} - ${escapeMarkdown(parseHTMLElements(x.title))}`).join("\n")}\`\`\``).setAuthor({
                    name: i18n.__("commands.music.search.trackSelectionMessage"),
                    iconURL: this.client.user?.displayAvatarURL()
                }).setFooter({
                    text: i18n.__mf("commands.music.search.cancelMessage", {
                        cancel: "cancel",
                        c: "c"
                    })
                })
            ]
        });
        const respond = await msg.channel.awaitMessages({
            errors: [
                "time"
            ],
            filter: (m)=>{
                const nums = m.content.split(/\s*,\s*/).filter((x)=>Number(x) > 0 && Number(x) <= tracks.items.length);
                return m.author.id === ctx.author.id && ([
                    "c",
                    "cancel"
                ].includes(m.content.toLowerCase()) || nums.length >= 1);
            },
            max: 1
        }).catch(()=>undefined);
        if (!respond) {
            msg.delete().catch((err)=>this.client.logger.error("SEARCH_SELECTION_DELETE_MSG_ERR:", err));
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.search.noSelection"), true)
                ]
            });
        }
        if ([
            "c",
            "cancel"
        ].includes(respond.first()?.content.toLowerCase() ?? "")) {
            msg.delete().catch((err)=>this.client.logger.error("SEARCH_SELECTION_DELETE_MSG_ERR:", err));
            return ctx.reply({
                embeds: [
                    createEmbed("info", i18n.__("commands.music.search.canceledMessage"), true)
                ]
            });
        }
        msg.delete().catch((err)=>this.client.logger.error("SEARCH_SELECTION_DELETE_MSG_ERR:", err));
        respond.first()?.delete().catch((err)=>this.client.logger.error("SEARCH_SELECTION_NUM_DELETE_MSG_ERR:", err));
        const songs = respond.first().content.split(/\s*,\s*/).filter((x)=>Number(x) > 0 && Number(x) <= tracks.items.length).sort((a, b)=>Number(a) - Number(b));
        const newCtx = new CommandContext(ctx.context, []);
        newCtx.additionalArgs.set("values", songs.map((x)=>tracks.items[Number(x) - 1].url));
        newCtx.additionalArgs.set("fromSearch", true);
        this.client.commands.get("play").execute(newCtx);
    }
    // eslint-disable-next-line class-methods-use-this
    generateSelectMenu(tracks) {
        const emojis = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟"
        ];
        return tracks.slice(0, 10).map((x, i)=>({
                label: x.title.length > 98 ? `${x.title.slice(0, 97)}...` : x.title,
                emoji: emojis[i],
                value: x.url
            }));
    }
};
__decorate([
    inVC,
    validVC,
    sameVC
], SearchCommand.prototype, "execute", null);
SearchCommand = __decorate([
    Command({
        aliases: [
            "sc"
        ],
        contextChat: "Add to queue",
        description: i18n.__("commands.music.search.description"),
        name: "search",
        slash: {
            description: i18n.__("commands.music.search.slashDescription"),
            options: [
                {
                    description: i18n.__("commands.music.search.slashQueryDescription"),
                    name: "query",
                    type: ApplicationCommandOptionType.String
                },
                {
                    choices: [
                        {
                            name: "YouTube",
                            value: "youtube"
                        },
                        {
                            name: "SoundCloud",
                            value: "soundcloud"
                        }
                    ],
                    description: i18n.__("commands.music.search.slashSourceDescription"),
                    name: "source",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.music.search.usage")
    })
], SearchCommand);
