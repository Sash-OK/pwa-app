const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

const notifications = [];
let increment = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', cors());

app.get('/notifications', (request, response) => {
  response.send(notifications);
});

app.post('/notifications', (request, response) => {
  const message = {...request.body, id: increment++};
  notifications.push(message);
  response.send(message);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Crushed', err);
  }
  console.log(`server is listening on ${port}`);
});
