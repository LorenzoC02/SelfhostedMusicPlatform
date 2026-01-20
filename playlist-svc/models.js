const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Track = sequelize.define('Track', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true,
  },
});

// Many-to-Many Relationship
Playlist.belongsToMany(Track, { through: 'PlaylistTracks' });
Track.belongsToMany(Playlist, { through: 'PlaylistTracks' });

module.exports = { Playlist, Track };
