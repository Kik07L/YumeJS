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
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType } from "discord.js";
const DATAS = [
    {
        style: ButtonStyle.Secondary,
        emoji: "⏪",
        customId: `PREV10`,
        type: ComponentType.Button
    },
    {
        style: ButtonStyle.Primary,
        emoji: "⬅️",
        customId: "PREV",
        type: ComponentType.Button
    },
    {
        style: ButtonStyle.Danger,
        emoji: "🚫",
        customId: "STOP",
        type: ComponentType.Button
    },
    {
        style: ButtonStyle.Primary,
        emoji: "➡️",
        customId: "NEXT",
        type: ComponentType.Button
    },
    {
        style: ButtonStyle.Secondary,
        emoji: "⏩",
        customId: "NEXT10",
        type: ComponentType.Button
    }
];
export class ButtonPagination {
    async start() {
        const embed = this.payload.embed;
        const pages = this.payload.pages;
        let index = 0;
        this.payload.edit.call(this, index, embed, pages[index]);
        const isInteraction = this.msg instanceof CommandInteraction;
        const buttons = DATAS.map((d)=>new ButtonBuilder(d));
        const toSend = {
            content: this.payload.content,
            embeds: [
                embed
            ],
            components: pages.length < 2 ? [] : [
                new ActionRowBuilder().addComponents(buttons)
            ]
        };
        const msg = await (isInteraction ? this.msg.editReply(toSend) : await this.msg.edit(toSend));
        const fetchedMsg = await this.msg.client.channels.cache.get(this.msg.channelId).messages.fetch(msg.id);
        if (pages.length < 2) return;
        const collector = fetchedMsg.createMessageComponentCollector({
            filter: (i)=>{
                void i.deferUpdate();
                return DATAS.map((x)=>x.customId.toLowerCase()).includes(i.customId.toLowerCase()) && i.user.id === this.payload.author;
            },
            componentType: ComponentType.Button
        });
        collector.on("collect", async (i)=>{
            switch(i.customId){
                case "PREV10":
                    index -= 10;
                    break;
                case "PREV":
                    index--;
                    break;
                case "NEXT":
                    index++;
                    break;
                case "NEXT10":
                    index += 10;
                    break;
                default:
                    void msg.delete();
                    return;
            }
            index = (index % pages.length + Number(pages.length)) % pages.length;
            this.payload.edit.call(this, index, embed, pages[index]);
            await fetchedMsg.edit({
                embeds: [
                    embed
                ],
                content: this.payload.content,
                components: pages.length < 2 ? [] : [
                    new ActionRowBuilder().addComponents(buttons)
                ]
            });
        });
    }
    constructor(msg, payload){
        _define_property(this, "msg", void 0);
        _define_property(this, "payload", void 0);
        this.msg = msg;
        this.payload = payload;
    }
}
