const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Mock Data (In a real app, you would fetch this from MongoDB)
const skills = [
    { name: 'HTML', icon: 'fab fa-html5' },
    { name: 'CSS', icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', icon: 'fab fa-js' },
    { name: 'Node.js', icon: 'fab fa-node-js' },
    { name: 'Express', icon: 'fas fa-server' },
    { name: 'EJS', icon: 'fas fa-code' },
    { name: 'SQL', icon: 'fas fa-database' },
    { name: 'MongoDB', icon: 'fas fa-leaf' },
    { name: 'React', icon: 'fab fa-react' },
    { name: 'Git/GitHub', icon: 'fab fa-github' }
];

const projects = [
    { title: 'Stone Paper Scissors', image: '/images/game.jpg', desc: 'Interactive JS Game' },
    { title: 'Database System', image: '/images/db.jpg', desc: 'Relational Management Tool' },
    { title: 'E-Commerce Web', image: '/images/shop.jpg', desc: 'Full-stack Shopping Experience' },
    { title: 'Todo Game', image: '/images/todo.jpg', desc: 'Gamified Task Manager' }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        name: 'Pankaj Jha', 
        role: 'BCA Student & Developer',
        skills, 
        projects 
    });
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