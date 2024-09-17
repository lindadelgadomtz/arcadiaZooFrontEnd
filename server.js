const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname)));

// Return index.html for any routes that aren't files
app.get('*', (req, res) => {
  const routePath = path.join(__dirname, req.path);
  if (path.extname(routePath)) {
    res.sendFile(routePath); // Serve the file if it exists
  } else {
    res.sendFile(path.join(__dirname, 'index.html')); // Otherwise, serve index.html for SPA
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
