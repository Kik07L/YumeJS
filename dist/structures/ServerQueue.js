/* eslint-disable no-nested-ternary */ function _define_property(obj, key, value) {
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
import { SongManager } from "../utils/structures/SongManager";
import { createEmbed } from "../utils/functions/createEmbed";
import { play } from "../utils/handlers/GeneralUtil";
import i18n from "../config";
import { AudioPlayerStatus, createAudioPlayer } from "@discordjs/voice";
const nonEnum = {
    enumerable: false
};
export class ServerQueue {
    setFilter(filter, state) {
        const before = this.filters[filter];
        this.filters[filter] = state;
        if (before !== state && this.player.state.status === AudioPlayerStatus.Playing) {
            this.playing = false;
            void play(this.textChannel.guild, this.player.state.resource.metadata.key, true);
        }
    }
    stop() {
        this.songs.clear();
        this.player.stop(true);
    }
    destroy() {
        this.stop();
        this.connection?.disconnect();
        clearTimeout(this.timeout);
        clearTimeout(this.dcTimeout);
        delete this.textChannel.guild.queue;
    }
    get volume() {
        return this._volume;
    }
    set volume(newVol) {
        this._volume = newVol;
        this.player.state.resource.volume?.setVolumeLogarithmic(this._volume / 100);
    }
    get skipVoters() {
        return this._skipVoters;
    }
    set skipVoters(value) {
        this._skipVoters = value;
    }
    get lastMusicMsg() {
        return this._lastMusicMsg;
    }
    set lastMusicMsg(value) {
        if (this._lastMusicMsg !== null) {
            this.textChannel.messages.fetch(this._lastMusicMsg).then((msg)=>{
                void msg.delete();
            }).catch((err)=>this.textChannel.client.logger.error("DELETE_LAST_MUSIC_MESSAGE_ERR:", err));
        }
        this._lastMusicMsg = value;
    }
    get lastVSUpdateMsg() {
        return this._lastVSUpdateMsg;
    }
    set lastVSUpdateMsg(value) {
        if (this._lastVSUpdateMsg !== null) {
            this.textChannel.messages.fetch(this._lastVSUpdateMsg).then((msg)=>{
                void msg.delete();
            }).catch((err)=>this.textChannel.client.logger.error("DELETE_LAST_VS_UPDATE_MESSAGE_ERR:", err));
        }
        this._lastVSUpdateMsg = value;
    }
    get playing() {
        return this.player.state.status === AudioPlayerStatus.Playing;
    }
    set playing(value) {
        if (value) {
            this.player.unpause();
        } else {
            this.player.pause();
        }
    }
    get idle() {
        return this.player.state.status === AudioPlayerStatus.Idle && this.songs.size === 0;
    }
    get client() {
        return this.textChannel.client;
    }
    sendStartPlayingMsg(newSong) {
        this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Track: "${newSong.title}" on ${this.textChannel.guild.name} has started.`);
        this.textChannel.send({
            embeds: [
                createEmbed("info", `▶ **|** ${i18n.__mf("utils.generalHandler.startPlaying", {
                    song: `[${newSong.title}](${newSong.url})`
                })}`).setThumbnail(newSong.thumbnail)
            ]
        }).then((m)=>this.lastMusicMsg = m.id).catch((e)=>this.client.logger.error("PLAY_ERR:", e));
    }
    constructor(textChannel){
        _define_property(this, "textChannel", void 0);
        _define_property(this, "stayInVC", void 0);
        _define_property(this, "player", void 0);
        _define_property(this, "connection", void 0);
        _define_property(this, "dcTimeout", void 0);
        _define_property(this, "timeout", void 0);
        _define_property(this, "songs", void 0);
        _define_property(this, "loopMode", void 0);
        _define_property(this, "shuffle", void 0);
        _define_property(this, "filters", void 0);
        _define_property(this, "_lastVSUpdateMsg", void 0);
        _define_property(this, "_lastMusicMsg", void 0);
        _define_property(this, "_skipVoters", void 0);
        _define_property(this, "_volume", void 0);
        this.textChannel = textChannel;
        this.stayInVC = this.textChannel.client.config.stayInVCAfterFinished;
        this.player = createAudioPlayer();
        this.connection = null;
        this.dcTimeout = null;
        this.timeout = null;
        this.songs = new SongManager(this.client, this.textChannel.guild);
        this.loopMode = "OFF";
        this.shuffle = false;
        this.filters = {};
        this._lastVSUpdateMsg = null;
        this._lastMusicMsg = null;
        this._skipVoters = [];
        this._volume = 100;
        Object.defineProperties(this, {
            _skipVoters: nonEnum,
            _lastMusicMsg: nonEnum,
            _lastVSUpdateMsg: nonEnum,
            _volume: nonEnum
        });
        this.player.on("stateChange", (oldState, newState)=>{
            if (newState.status === AudioPlayerStatus.Playing && oldState.status !== AudioPlayerStatus.Paused) {
                newState.resource.volume?.setVolumeLogarithmic(this.volume / 100);
                const newSong = this.player.state.resource.metadata.song;
                this.sendStartPlayingMsg(newSong);
            } else if (newState.status === AudioPlayerStatus.Idle) {
                const song = oldState.resource.metadata;
                this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Track: "${song.song.title}" on ${this.textChannel.guild.name} has ended.`);
                this.skipVoters = [];
                if (this.loopMode === "OFF") {
                    this.songs.delete(song.key);
                }
                const nextS = this.shuffle && this.loopMode !== "SONG" ? this.songs.random()?.key : this.loopMode === "SONG" ? song.key : this.songs.sortByIndex().filter((x)=>x.index > song.index).first()?.key ?? (this.loopMode === "QUEUE" ? this.songs.sortByIndex().first()?.key ?? "" : "");
                this.textChannel.send({
                    embeds: [
                        createEmbed("info", `⏹ **|** ${i18n.__mf("utils.generalHandler.stopPlaying", {
                            song: `[${song.song.title}](${song.song.url})`
                        })}`).setThumbnail(song.song.thumbnail)
                    ]
                }).then((m)=>this.lastMusicMsg = m.id).catch((e)=>this.client.logger.error("PLAY_ERR:", e)).finally(()=>{
                    play(this.textChannel.guild, nextS).catch((e)=>{
                        this.textChannel.send({
                            embeds: [
                                createEmbed("error", i18n.__mf("utils.generalHandler.errorPlaying", {
                                    message: `\`${e}\``
                                }), true)
                            ]
                        }).catch((er)=>this.client.logger.error("PLAY_ERR:", er));
                        this.connection?.disconnect();
                        return this.client.logger.error("PLAY_ERR:", e);
                    });
                });
            }
        }).on("error", (err)=>{
            this.textChannel.send({
                embeds: [
                    createEmbed("error", i18n.__mf("utils.generalHandler.errorPlaying", {
                        message: `\`${err.message}\``
                    }), true)
                ]
            }).catch((e)=>this.client.logger.error("PLAY_CMD_ERR:", e));
            this.destroy();
            this.client.logger.error("PLAY_ERR:", err);
        }).on("debug", (message)=>{
            this.client.logger.debug(message);
        });
    }
}
