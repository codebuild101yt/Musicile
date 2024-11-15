const express = require('express');
const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Route to get the daily song
app.get('/daily-song', async (req, res) => {
    try {
        const songData = await getDailySong(); // Function to get the daily song
        res.json(songData); // Send song data back to the frontend
    } catch (error) {
        console.error("Error fetching daily song:", error);
        res.status(500).json({ error: "Failed to fetch daily song" }); // Handle error gracefully
    }
});

// Route to get random songs for multiple choice
app.get('/random-songs', async (req, res) => {
    try {
        const token = await getSpotifyAccessToken(); // Fetch access token from Spotify API
        const playlistTracks = await getPlaylistTracks(token); // Get tracks from the playlist

        // Remove the daily song from the options
        const dailySong = await getDailySong();
        const randomSongs = playlistTracks.filter(track => track.id !== dailySong.id);

        // Pick 3 random songs
        const selectedSongs = [];
        for (let i = 0; i < 3; i++) {
            const randomSong = randomSongs[Math.floor(Math.random() * randomSongs.length)];
            selectedSongs.push(randomSong);
        }

        res.json(selectedSongs); // Return random songs as options
    } catch (error) {
        console.error('Error fetching random songs:', error);
        res.status(500).json({ error: "Failed to fetch random songs" });
    }
});

// Function to get the daily song
async function getDailySong() {
    try {
        const token = await getSpotifyAccessToken(); // Fetch access token from Spotify API
        const playlistTracks = await getPlaylistTracks(token); // Get tracks from the playlist

        // Pick a random song from the playlist
        const randomSong = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];

        return randomSong; // Return song data (you can format this as needed)
    } catch (error) {
        console.error('Error fetching daily song:', error);
        throw new Error('Failed to fetch daily song');
    }
}

// Function to get tracks from a Spotify playlist
async function getPlaylistTracks(token) {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
        const response = await axios.get(url, { headers });
        return response.data.items.map(item => item.track); // Return an array of tracks
    } catch (error) {
        console.error('Error fetching playlist tracks:', error);
        throw error;
    }
}

// Function to get an access token from Spotify (client credentials flow)
async function getSpotifyAccessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({
        grant_type: 'client_credentials',
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        return response.data.access_token; // Return access token
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

// Start the server and listen on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
