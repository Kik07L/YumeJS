/* eslint-disable @typescript-eslint/no-unused-vars, no-eval, prefer-named-capture-group */ var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { inspect } from "node:util";
export let EvalCommand = class EvalCommand1 extends BaseCommand {
    async execute(ctx) {
        const msg = ctx;
        const client = this.client;
        const code = ctx.args.join(" ").replace(RegExp("```(?:[^\\s]+\\n)?(.*?)\\n?```", "gs"), (_1, a1)=>a1);
        const embed = createEmbed("info").addFields([
            {
                name: i18n.__("commands.developers.eval.inputString"),
                value: `\`\`\`js\n${code}\`\`\``
            }
        ]);
        try {
            if (!code) {
                return await ctx.send({
                    embeds: [
                        createEmbed("error", i18n.__("commands.developers.eval.noCode"), true)
                    ]
                });
            }
            const isAsync = /--async\s*(--silent)?$/.test(code);
            const isSilent = /--silent\s*(--async)?$/.test(code);
            const toExecute = isAsync || isSilent ? code.replace(/--(async|silent)\s*(--(silent|async))?$/, "") : code;
            const evaled = inspect(await eval(isAsync ? `(async () => {\n${toExecute}\n})()` : toExecute), {
                depth: 0
            });
            if (isSilent) return;
            const cleaned = this.clean(evaled);
            const output = cleaned.length > 1024 ? `${await this.hastebin(cleaned)}.js` : `\`\`\`js\n${cleaned}\`\`\``;
            embed.addFields([
                {
                    name: i18n.__("commands.developers.eval.outputString"),
                    value: output
                }
            ]);
            ctx.send({
                askDeletion: {
                    reference: ctx.author.id
                },
                embeds: [
                    embed
                ]
            }).catch((e1)=>this.client.logger.error("PROMISE_ERR:", e1));
        } catch (e) {
            const cleaned = this.clean(String(e));
            const isTooLong = cleaned.length > 1024;
            const error = isTooLong ? `${await this.hastebin(cleaned)}.js` : `\`\`\`js\n${cleaned}\`\`\``;
            embed.setColor("Red").addFields([
                {
                    name: i18n.__("commands.developers.eval.errorString"),
                    value: error
                }
            ]);
            ctx.send({
                askDeletion: {
                    reference: ctx.author.id
                },
                embeds: [
                    embed
                ]
            }).catch((er1)=>this.client.logger.error("PROMISE_ERR:", er1));
        }
    }
    // eslint-disable-next-line class-methods-use-this
    clean(text1) {
        return text1.replace(new RegExp(process.env.DISCORD_TOKEN, "g"), "[REDACTED]").replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    async hastebin(text1) {
        const result1 = await this.client.request.post("https://bin.clytage.org/documents", {
            body: text1
        }).json();
        return `https://bin.clytage.org/${result1.key}`;
    }
};
EvalCommand = __decorate([
    Command({
        aliases: [
            "evaluate",
            "ev",
            "js-exec"
        ],
        cooldown: 0,
        description: i18n.__("commands.developers.eval.description"),
        devOnly: true,
        name: "eval",
        usage: i18n.__("commands.developers.eval.usage")
    })
], EvalCommand);
