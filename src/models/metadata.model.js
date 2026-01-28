const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
    postgresId: { type: Number, required: true, unique: true }, // Link to Postgres
    common: { type: Object }, // Store all common tags
    format: { type: Object }, // Store format info
    coverArt: {
        data: Buffer,
        format: String
    },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metadata', MetadataSchema);
