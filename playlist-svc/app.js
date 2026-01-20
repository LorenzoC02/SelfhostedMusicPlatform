const express = require('express');
const { connectDB, sequelize } = require('./db');
const { Playlist, Track } = require('./models');

const app = express();
app.use(express.json());

// Sync database
const initApp = async () => {
  await connectDB();
  await sequelize.sync(); // Using sync for simplicity as per guide.md suggestion
  console.log('Database synced');
};

initApp();

// REST API Endpoints

// Create a playlist
app.post('/playlists', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }
    const playlist = await Playlist.create({ name, userId });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all playlists for a user
app.get('/playlists', async (req, res) => {
  try {
    const { userId } = req.query;
    const where = userId ? { userId } : {};
    const playlists = await Playlist.findAll({ where });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific playlist with its tracks
app.get('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: Track,
    });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a playlist
app.put('/playlists/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    playlist.name = name || playlist.name;
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a playlist
app.delete('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    await playlist.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a track to a playlist
app.post('/playlists/:id/tracks', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, duration } = req.body;

    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Find or create the track
    const [track] = await Track.findOrCreate({
      where: { title, artist },
      defaults: { duration },
    });

    await playlist.addTrack(track);
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a track from a playlist
app.delete('/playlists/:id/tracks/:trackId', async (req, res) => {
  try {
    const { id, trackId } = req.params;
    const playlist = await Playlist.findByPk(id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const track = await Track.findByPk(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    await playlist.removeTrack(track);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Playlist service running on port ${PORT}`);
});
