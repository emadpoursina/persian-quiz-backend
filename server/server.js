const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', function (req, res) {
  res.sendFile(path.resolve('../dist/index.html'));
});

let port = 3001;
app.listen(port, () => {
  console.log(`Server is ready at port ${port}`);
});