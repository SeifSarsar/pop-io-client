import path from 'path';

const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), function () {
  console.log(`Server listening on port ${server.address().port}`);
});
