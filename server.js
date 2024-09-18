const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for all non-static file routes
app.get('*', (req, res) => {
  if (req.path.includes('.') || path.extname(req.path)) {
    res.sendFile(path.join(__dirname, req.path)); // Serve static file
  } else {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html for non-file routes
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
