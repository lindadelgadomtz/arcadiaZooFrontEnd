const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all non-static file routes (for SPA routing)
app.get('*', (req, res) => {
  // Check if the request is for a file (e.g., .js, .css, .png)
  if (req.path.includes('.') || path.extname(req.path)) {
    res.sendFile(path.join(__dirname, 'public', req.path)); // Serve static file from "public"
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html for non-file routes
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
