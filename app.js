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

app.get('/stone-paper-scissors', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.get('/database-system', (req, res) => {
    res.sendFile(path.join(__dirname, 'database.html'));
});

app.get('/ecommerce', (req, res) => {
    res.sendFile(path.join(__dirname, 'ecommerce.html'));
});

app.get('/todo-game', (req, res) => {
    res.sendFile(path.join(__dirname, 'todo.html'));
});

// Database Connection (Mongoose Example)

mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cinematic Portfolio running on http://localhost:${PORT}`);
});