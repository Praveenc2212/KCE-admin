const express = require('express');
const app = express();
const PORT = 2212;

// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// Base GET route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
