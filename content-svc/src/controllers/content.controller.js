const { pool } = require('../db/postgres');
const Metadata = require('../models/metadata.model');
const { extractMetadata } = require('../services/metadata.service');
const fs = require('fs');

exports.uploadContent = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filePath = req.file.path;

        const meta = await extractMetadata(filePath);

        const title = meta.common.title || 'Unknown Title';
        const artist = meta.common.artist || 'Unknown Artist';
        const duration = meta.format.duration || 0;

        const pgQuery = 'INSERT INTO tracks (title, artist, duration, file_path) VALUES ($1, $2, $3, $4) RETURNING id';
        const pgValues = [title, artist, duration, filePath];
        const pgResult = await pool.query(pgQuery, pgValues);
        const newTrackId = pgResult.rows[0].id;

        let coverArt = null;
        if (meta.common.picture && meta.common.picture.length > 0) {
            coverArt = {
                format: meta.common.picture[0].format,
                data: meta.common.picture[0].data
            };
        }

        const commonMeta = { ...meta.common };
        delete commonMeta.picture;

        const mongoMeta = new Metadata({
            postgresId: newTrackId,
            common: commonMeta,
            format: meta.format,
            coverArt: coverArt
        });

        await mongoMeta.save();

        res.status(201).json({
            message: 'File uploaded and processed successfully',
            track: {
                id: newTrackId,
                title,
                artist,
                duration,
                file_path: filePath
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
        }
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

exports.getContent = async (req, res) => {
    const { id } = req.params;
    try {
        const pgResult = await pool.query('SELECT * FROM tracks WHERE id = $1', [id]);

        if (pgResult.rows.length === 0) {
            return res.status(404).json({ error: 'Track not found' });
        }
        const track = pgResult.rows[0];

        const meta = await Metadata.findOne({ postgresId: id });

        res.json({
            track,
            metadata: meta || null
        });

    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.listContent = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tracks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('List content error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
