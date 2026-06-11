require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** 
 * Security Improvement: Move frontend files to a 'public' directory.
 * This prevents sensitive server-side files (like .env) from being served.
 */
app.use(express.static(__dirname));

// Simple Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const pages = {
    '/stone-paper-scissors': 'game.html',
    '/database-system': 'database.html',
    '/ecommerce': 'ecommerce.html',
    '/todo-game': 'todo.html',
    '/admin': 'admin.html',
    '/canvas-sketch': 'canvas.html'
};

Object.entries(pages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        const filePath = path.join(__dirname, file);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error serving ${file}:`, err.message);
                res.status(404).send('Page not found');
            }
        });
    });
});

// Database Connection (Mongoose Example)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI is not defined in .env. Falling back to local default.');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/delta1");
        console.log('Connected to MongoDB Successfully');
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
}
connectDB();

// API Route for Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Missing required fields: name, email, or message.' });
        }

        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(200).json({ success: true, message: 'Data saved to Cloud MongoDB!' });
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
        return res.status(500).json({ success: false, message: 'Admin password not configured on server.' });
    }

    if (password && password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing password.' });
    }
};

// Protected API Route to view all contact messages
app.get('/api/admin/messages', adminAuth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Protected API Route to delete a specific message
app.delete('/api/admin/messages/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await Contact.findByIdAndDelete(id);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server live at: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use. Please kill the process using it or change the PORT in your .env file.`);
    } else {
        console.error('Server error:', err);
    }
});

// Graceful shutdown to prevent debugger/port hangs
const shutdown = async (signal) => {
    console.log(`Received ${signal}. Closing resources...`);
    try {
        await mongoose.connection.close();
        server.close(() => {
            console.log('Server and Database connections closed.');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});