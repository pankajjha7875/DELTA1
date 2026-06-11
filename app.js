require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.json()); // Middleware to parse JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve all static files from public folder

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/stone-paper-scissors', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/database-system', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'database.html'));
});

app.get('/ecommerce', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ecommerce.html'));
});

app.get('/todo-game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'todo.html'));
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch(err => console.error('Database Connection Error:', err.message));

// Schema definition to store contact messages
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);

// Route to handle contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ success: true, message: 'Message received successfully!' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ success: false, message: 'An error occurred while saving your message.' });
    }
});

// Route to view all messages stored in the database
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Could not retrieve messages.' });
    }
});

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cinematic Portfolio running on http://localhost:${PORT}`);
});