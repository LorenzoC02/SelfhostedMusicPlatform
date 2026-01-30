const express = require('express');
const { connectDB, sequelize } = require('./db');
const { Playlist, Track } = require('./models');

const app = express();
app.use(express.json());

const initApp = async () => {
  await connectDB();
  await sequelize.sync();
  console.log('Database synced');
};

initApp();

app.post('/api/playlists', async (req, res) => {
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

app.get('/api/playlists', async (req, res) => {
  try {
    const { userId } = req.query;
    const where = userId ? { userId } : {};
    const playlists = await Playlist.findAll({ where });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
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

app.put('/api/playlists/:id', async (req, res) => {
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

app.delete('/api/playlists/:id', async (req, res) => {
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

app.post('/api/playlists/:id/tracks', async (req, res) => {
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

app.delete('/api/playlists/:id/tracks/:trackId', async (req, res) => {
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
