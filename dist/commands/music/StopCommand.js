var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
export let StopCommand = class StopCommand extends BaseCommand {
    execute(ctx) {
        ctx.guild?.queue?.stop();
        ctx.guild.queue.lastMusicMsg = null;
        ctx.reply({
            embeds: [
                createEmbed("success", `⏹ **|** ${i18n.__("commands.music.stop.stoppedMessage")}`)
            ]
        }).catch((e)=>this.client.logger.error("STOP_CMD_ERR:", e));
    }
};
__decorate([
    inVC,
    validVC,
    sameVC
], StopCommand.prototype, "execute", null);
StopCommand = __decorate([
    Command({
        aliases: [
            "disconnect",
            "dc"
        ],
        description: i18n.__("commands.music.stop.description"),
        name: "stop",
        slash: {
            options: []
        },
        usage: "{prefix}stop"
    })
], StopCommand);
