const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// Parse URL-encoded form data (built-in in Express)
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static(path.join(__dirname, 'public')));

// GET route - show form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// POST route - handle form submission
app.post('/register', (req, res) => {
  const { name, email, course } = req.body;
  console.log("Student Registered:", { name, email, course });
  res.send(`<h2>Thank you, ${name}! You have registered for ${course}.</h2>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
