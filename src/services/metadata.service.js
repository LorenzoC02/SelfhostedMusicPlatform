const mm = require('music-metadata');

const extractMetadata = async (filePath) => {
    try {
        const metadata = await mm.parseFile(filePath);
        return {
            common: metadata.common, // title, artist, album, year, etc.
            format: metadata.format, // duration, bitrate, sampleRate
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        throw error;
    }
};

module.exports = { extractMetadata };
