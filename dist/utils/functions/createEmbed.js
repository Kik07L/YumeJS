import { embedColor, noEmoji, yesEmoji } from "../../config";
import { EmbedBuilder } from "discord.js";
const hexColors = {
    error: "Red",
    info: embedColor,
    success: "Green",
    warn: "Yellow"
};
export function createEmbed(type, message, emoji = false) {
    const embed = new EmbedBuilder().setColor(hexColors[type]);
    if (message) embed.setDescription(message);
    if (type === "error" && emoji) embed.setDescription(`${noEmoji} **|** ${message}`);
    if (type === "success" && emoji) embed.setDescription(`${yesEmoji} **|** ${message}`);
    return embed;
}
