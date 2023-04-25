/* eslint-disable @typescript-eslint/no-unnecessary-condition, no-nested-ternary */ function _define_property(obj, key, value) {
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
import { ActionRowBuilder, BaseInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, Collection, CommandInteraction, ContextMenuCommandInteraction, Message, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
export class CommandContext {
    async deferReply() {
        if (this.isInteraction()) {
            return this.context.deferReply();
        }
        return Promise.resolve(undefined);
    }
    async reply(options, autoedit) {
        if (this.isInteraction()) {
            if ((this.context.isCommand() || this.context.isStringSelectMenu()) && this.context.replied && !autoedit) throw new Error("Interaction is already replied.");
        }
        const context = this.context;
        const rep = await this.send(options, this.isInteraction() ? context.isCommand() || context.isStringSelectMenu() ? context.replied || context.deferred ? "editReply" : "reply" : "reply" : "reply").catch((e)=>({
                error: e
            }));
        if (!rep || "error" in rep) {
            throw new Error(`Unable to reply context, because: ${rep ? rep.error.message : "Unknown"}`);
        }
        // @ts-expect-error-next-line
        return rep instanceof Message ? rep : new Message(this.context.client, rep);
    }
    async send(options, type = "editReply") {
        const deletionBtn = new ActionRowBuilder().addComponents(new ButtonBuilder().setEmoji("🗑️").setStyle(ButtonStyle.Danger));
        if (options.askDeletion) {
            deletionBtn.components[0].setCustomId(Buffer.from(`${options.askDeletion.reference}_delete-msg`).toString("base64"));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            options.components ? options.components.push(deletionBtn) : options.components = [
                deletionBtn
            ];
        }
        if (this.isInteraction()) {
            options.fetchReply = true;
            const msg = await this.context[type](options);
            const channel = this.context.channel;
            const res = await channel.messages.fetch(msg.id).catch(()=>null);
            return res ?? msg;
        }
        if (options.ephemeral) {
            throw new Error("Cannot send ephemeral message in a non-interaction context.");
        }
        if (typeof options === "string") {
            options = {
                content: options
            };
        }
        (options.allowedMentions ??= {}).repliedUser = false;
        return this.context.reply(options);
    }
    isInteraction() {
        return this.context instanceof BaseInteraction;
    }
    isCommand() {
        return this.context instanceof CommandInteraction;
    }
    isContextMenu() {
        return this.context instanceof ContextMenuCommandInteraction;
    }
    isMessageComponent() {
        return this.context instanceof MessageComponentInteraction;
    }
    isButton() {
        return this.context instanceof ButtonInteraction;
    }
    isStringSelectMenu() {
        return this.context instanceof MessageComponentInteraction;
    }
    isModal() {
        return this.context instanceof ModalSubmitInteraction;
    }
    get mentions() {
        return this.context instanceof Message ? this.context.mentions : null;
    }
    get deferred() {
        return this.context instanceof BaseInteraction ? this.context.deferred : false;
    }
    get options() {
        /* Not sure about this but CommandInteraction does not provides getString method anymore */ return this.context instanceof BaseInteraction ? this.context.options : null;
    }
    get fields() {
        return this.context instanceof ModalSubmitInteraction ? this.context.fields : null;
    }
    get author() {
        return this.context instanceof BaseInteraction ? this.context.user : this.context.author;
    }
    get member() {
        return this.guild.members.resolve(this.author.id);
    }
    constructor(context, args = []){
        _define_property(this, "context", void 0);
        _define_property(this, "args", void 0);
        _define_property(this, "additionalArgs", void 0);
        _define_property(this, "channel", void 0);
        _define_property(this, "guild", void 0);
        this.context = context;
        this.args = args;
        this.additionalArgs = new Collection();
        this.channel = this.context.channel;
        this.guild = this.context.guild;
    }
}
