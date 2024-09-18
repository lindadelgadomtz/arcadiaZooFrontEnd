const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serve index.html for all non-static file routes (to handle SPA routing)
app.get('*', (req, res) => {
  // Check if the request is for a file (e.g., .js, .css, .png)
  if (req.path.includes('.') || path.extname(req.path)) {
    res.sendFile(path.join(__dirname, req.path)); // Serve static file
  } else {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html for non-file routes
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
