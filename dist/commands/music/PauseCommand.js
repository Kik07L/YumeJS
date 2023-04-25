var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
export let PauseCommand = class PauseCommand extends BaseCommand {
    execute(ctx) {
        if (!ctx.guild?.queue?.playing) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.music.pause.alreadyPause"))
                ]
            });
        }
        ctx.guild.queue.playing = false;
        return ctx.reply({
            embeds: [
                createEmbed("success", `⏸ **|** ${i18n.__("commands.music.pause.pauseMessage")}`)
            ]
        });
    }
};
__decorate([
    inVC,
    haveQueue,
    sameVC
], PauseCommand.prototype, "execute", null);
PauseCommand = __decorate([
    Command({
        description: i18n.__("commands.music.pause.description"),
        name: "pause",
        slash: {
            options: []
        },
        usage: "{prefix}pause"
    })
], PauseCommand);
