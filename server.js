const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from public/service (for /service/*)
app.use('/service', express.static(path.join(__dirname, 'public', 'service')));

// Ultraviolet proxy endpoints (example, adjust as needed)
// If you have custom proxy logic, require and use it here
// Example: app.use('/service', require('./public/service/uv/uv.handler.js'));

// Proxy/service route example (adjust as needed)
app.get('/service', (req, res, next) => {
  // If no query param, show 404 in iframe
  if (!req.query.q) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  // If you want to always show 404.html for /service, uncomment below:
  // return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  // ...your proxy logic here...
  // If error or not found, call next() to trigger 404
  next();
});

// Force 404.html for any GET /service (no query or not handled)
app.all('/service*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Catch-all for 404s (any route not handled above)
app.use((req, res) => {
  // If request is for iframe (Accept: text/html), show 404.html
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else {
    res.status(404).send('404 Not Found');
  }
});

// Error handler for any other errors
app.use((err, req, res, next) => {
  res.status(500).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Solo Central v5 server running on http://localhost:${PORT}`);
});
