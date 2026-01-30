const express = require('express');
const dotenv = require('dotenv');
const { initDb } = require('./db/postgres');
const connectMongo = require('./db/mongo');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.MEDIA_STORAGE_PATH || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const contentRoutes = require('./routes/content.routes');
app.use('/api/content', contentRoutes);

// Init DBs

initDb();
connectMongo();

app.get('/', (req, res) => {
    res.send('Content Service is running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
