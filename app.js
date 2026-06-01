const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.json()); // Middleware to parse JSON data
app.use(express.static(path.join(__dirname))); // Serve all static files from root

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database Connection (Mongoose Example)
/*
mongoose.connect('mongodb://localhost:27017/portfolio')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cinematic Portfolio running on http://localhost:${PORT}`);
});