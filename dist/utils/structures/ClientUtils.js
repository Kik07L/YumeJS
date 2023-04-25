/* eslint-disable class-methods-use-this */ function _define_property(obj, key, value) {
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
import { ChannelType } from "discord.js";
import { execSync } from "node:child_process";
import { parse } from "node:path";
import prism from "prism-media";
const { FFmpeg  } = prism;
export class ClientUtils {
    async fetchMuteRole(guild) {
        const id = this.client.data.data?.[guild.id]?.mute;
        return id ? guild.roles.fetch(id).catch(()=>null) : null;
    }
    async fetchDJRole(guild) {
        const data = this.client.data.data?.[guild.id]?.dj;
        if (data?.enable && data.role) return guild.roles.fetch(data.role);
        return null;
    }
    requiredVoters(memberAmount) {
        return Math.round(memberAmount / 2);
    }
    decode(string) {
        return Buffer.from(string, "base64").toString("ascii");
    }
    async getUserCount() {
        let arr = [];
        if (this.client.shard) {
            const shardUsers = await this.client.shard.broadcastEval((c)=>c.users.cache.map((x)=>x.id));
            for (const users of shardUsers){
                arr = arr.concat(users);
            }
        } else {
            arr = this.client.users.cache.map((x)=>x.id);
        }
        return arr.filter((x, i)=>arr.indexOf(x) === i).length;
    }
    async getChannelCount(textOnly = false, voiceOnly = false) {
        let arr = [];
        if (this.client.shard) {
            const shardChannels = await this.client.shard.broadcastEval((c, t)=>c.channels.cache.filter((ch)=>{
                    if (t.textOnly) {
                        return ch.type === t.types.GuildText || ch.type === t.types.PublicThread || ch.type === t.types.PrivateThread;
                    } else if (t.voiceOnly) {
                        return ch.type === t.types.GuildVoice;
                    }
                    return true;
                }).map((ch)=>ch.id), {
                context: {
                    textOnly,
                    voiceOnly,
                    types: ChannelType
                }
            });
            for (const channels of shardChannels){
                arr = arr.concat(channels);
            }
        } else {
            arr = this.client.channels.cache.filter((ch)=>{
                if (textOnly) {
                    return ch.type === ChannelType.GuildText || ch.type === ChannelType.PublicThread || ch.type === ChannelType.PrivateThread;
                } else if (voiceOnly) {
                    return ch.type === ChannelType.GuildVoice;
                }
                return true;
            }).map((ch)=>ch.id);
        }
        return arr.filter((x, i)=>arr.indexOf(x) === i).length;
    }
    async getGuildCount() {
        if (this.client.shard) {
            const guilds = await this.client.shard.broadcastEval((c)=>c.guilds.cache.size);
            return guilds.reduce((prev, curr)=>prev + curr);
        }
        return this.client.guilds.cache.size;
    }
    async getPlayingCount() {
        if (this.client.shard) {
            const playings = await this.client.shard.broadcastEval((c)=>c.guilds.cache.filter((x)=>x.queue?.playing === true).size);
            return playings.reduce((prev, curr)=>prev + curr);
        }
        return this.client.guilds.cache.filter((x)=>x.queue?.playing === true).size;
    }
    async import(path, ...args) {
        const file = await import(path).then((m)=>m[parse(path).name]);
        return file ? new file(...args) : undefined;
    }
    getFFmpegVersion() {
        try {
            const ffmpeg = FFmpeg.getInfo();
            return ffmpeg.version.split(/_|-| /).find((x)=>/[0-9.]/.test(x))?.replace(/[^0-9.]/g, "") ?? "Unknown";
        } catch  {
            return "Unknown";
        }
    }
    getCommitHash(ref, short = true) {
        try {
            const res = execSync(`git rev-parse${short ? " --short" : ""} ${ref}`);
            return res.toString().trim();
        } catch  {
            return "???";
        }
    }
    constructor(client){
        _define_property(this, "client", void 0);
        this.client = client;
    }
}
