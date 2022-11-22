const { Pool } = require("pg");

class PlaylistService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT 
        playlists.id AS "playlistId",
        playlists.name,
        song.id,
        song.title,
        song.performer
      FROM public.playlists 
      LEFT JOIN public.playlist_songs 
        ON playlists.id = playlist_songs.playlist_id 
      JOIN public.song 
        ON song.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);

    if (!result.rows[0]?.playlistId) {
      return {
        id: playlistId,
        error: "id tidak ditemukan",
      };
    }
    const playlist = {
      id: result.rows[0].playlistId,
      name: result.rows[0].name,
    };

    if (!result.rows[0]?.id) {
      return playlist;
    }
    
    const songs = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    return {
      ...playlist,
      songs,
    };
  }
}

module.exports = PlaylistService;
