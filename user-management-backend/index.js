const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

let users = [];

// Load users from JSON file
if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
}

// Save users to JSON file
const saveUsers = () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// CRUD operations
app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    saveUsers();
    res.status(201).json(user);
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = req.body;
        saveUsers();
        res.json(users[index]);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    users = users.filter(u => u.id !== id);
    saveUsers();
    res.status(204).send();
});

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
