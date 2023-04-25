var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CommandContext } from "../structures/CommandContext";
import { createEmbed } from "../utils/functions/createEmbed";
import { BaseEvent } from "../structures/BaseEvent";
import { Event } from "../utils/decorators/Event";
import i18n from "../config";
import { ApplicationCommandType, Message, PermissionsBitField } from "discord.js";
export let InteractionCreateEvent = class InteractionCreateEvent extends BaseEvent {
    async execute(interaction) {
        this.client.debugLog.logData("info", "INTERACTION_CREATE", [
            [
                "Type",
                interaction.type.toString()
            ],
            [
                "Guild",
                interaction.inGuild() ? `${interaction.guild?.name ?? "[???]"}(${interaction.guildId})` : "DM"
            ],
            [
                "Channel",
                (interaction.channel?.type ?? "DM") === "DM" ? "DM" : `${interaction.channel.name}(${interaction.channel.id})`
            ],
            [
                "User",
                `${interaction.user.tag}(${interaction.user.id})`
            ]
        ]);
        if (!interaction.inGuild() || !this.client.commands.isReady) return;
        if (interaction.isButton()) {
            const val = this.client.utils.decode(interaction.customId);
            const user = val.split("_")[0] ?? "";
            const cmd = val.split("_")[1] ?? "";
            if (cmd === "delete-msg") {
                if (interaction.user.id !== user && !new PermissionsBitField(interaction.member.permissions).has(PermissionsBitField.Flags.ManageMessages)) {
                    void interaction.reply({
                        ephemeral: true,
                        embeds: [
                            createEmbed("error", i18n.__mf("events.createInteraction.message1", {
                                user: user.toString()
                            }), true)
                        ]
                    });
                } else {
                    const msg = await interaction.channel?.messages.fetch(interaction.message.id).catch(()=>null);
                    if (msg?.deletable) {
                        void msg.delete();
                    }
                }
            }
        }
        const context = new CommandContext(interaction);
        if (interaction.isUserContextMenuCommand()) {
            const data = interaction.options.getUser("user") ?? interaction.options.getMessage("message");
            let dataType = ApplicationCommandType.User;
            if (data instanceof Message) {
                dataType = ApplicationCommandType.Message;
            }
            const cmd = this.client.commands.find((x)=>dataType === ApplicationCommandType.Message ? x.meta.contextChat === interaction.commandName : x.meta.contextUser === interaction.commandName);
            if (cmd) {
                context.additionalArgs.set("options", data);
                void cmd.execute(context);
            }
        }
        if (interaction.isCommand()) {
            const cmd = this.client.commands.filter((x)=>x.meta.slash !== undefined).find((x)=>x.meta.slash.name === interaction.commandName);
            if (cmd) {
                void cmd.execute(context);
            }
        }
        if (interaction.isStringSelectMenu()) {
            const val = this.client.utils.decode(interaction.customId);
            const user = val.split("_")[0] ?? "";
            const cmd = val.split("_")[1] ?? "";
            const exec = (val.split("_")[2] ?? "yes") === "yes";
            if (interaction.user.id !== user) {
                void interaction.reply({
                    ephemeral: true,
                    embeds: [
                        createEmbed("error", i18n.__mf("events.createInteraction.message1", {
                            user: user.toString()
                        }), true)
                    ]
                });
            }
            if (cmd && user === interaction.user.id && exec) {
                const command = this.client.commands.filter((x)=>x.meta.slash !== undefined).find((x)=>x.meta.name === cmd);
                if (command) {
                    context.additionalArgs.set("values", interaction.values);
                    void command.execute(context);
                }
            }
        }
    }
};
InteractionCreateEvent = __decorate([
    Event("interactionCreate")
], InteractionCreateEvent);
