const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Node.js server!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});