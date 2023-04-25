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
export class SpotifyUtil {
    async fetchToken() {
        const { accessToken , accessTokenExpirationTimestampMs  } = await this.client.request.get("https://open.spotify.com/get_access_token", {
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"
            }
        }).json();
        if (!accessToken) throw new Error("Could not fetch self Spotify token.");
        this.token = `Bearer ${accessToken}`;
        return new Date(accessTokenExpirationTimestampMs).getMilliseconds() * 1000;
    }
    async renew() {
        const lastRenew = await this.fetchToken();
        setTimeout(()=>this.renew(), lastRenew);
    }
    resolveTracks(url) {
        const [, type, id] = this.spotifyRegex.exec(url) ?? [];
        switch(type){
            case "track":
                {
                    return this.getTrack(id);
                }
            case "playlist":
                {
                    return this.getPlaylist(id);
                }
        }
    }
    async getPlaylist(id) {
        const playlistResponse = await this.client.request.get(`${this.baseURI}/playlists/${id}`, {
            headers: {
                Authorization: this.token
            }
        }).json();
        let next = playlistResponse.tracks.next;
        while(next){
            const nextPlaylistResponse = await this.client.request.get(next, {
                headers: {
                    Authorization: this.token
                }
            }).json();
            next = nextPlaylistResponse.next;
            playlistResponse.tracks.items.push(...nextPlaylistResponse.items);
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return playlistResponse.tracks.items.filter((spotifyTrack)=>spotifyTrack.track);
    }
    getTrack(id) {
        return this.client.request.get(`${this.baseURI}/tracks/${id}`, {
            headers: {
                Authorization: this.token
            }
        }).json();
    }
    constructor(client){
        _define_property(this, "client", void 0);
        // eslint-disable-next-line prefer-named-capture-group
        _define_property(this, "spotifyRegex", void 0);
        _define_property(this, "baseURI", void 0);
        _define_property(this, "token", void 0);
        this.client = client;
        this.spotifyRegex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album)[/:]([A-Za-z0-9]+)/;
        this.baseURI = "https://api.spotify.com/v1";
    }
}
