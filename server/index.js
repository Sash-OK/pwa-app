const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

const urlBase = '/api';
let notifications = [];
let increment = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', cors());

app.get(`${urlBase}/notifications`, (request, response) => {
  response.send(notifications);
});

app.get(`${urlBase}/health-check`, (request, response) => {
  response.send({status: true});
});

app.post(`${urlBase}/notifications`, (request, response) => {

  if (Array.isArray(request.body)) {
    notifications = [...notifications, ...request.body.map(notification => ({...notification, id: increment++}))]
  } else {
    notifications.push({...request.body, id: increment++});
  }

  response.send(notifications);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Crushed', err);
  }
  console.log(`server is listening on ${port}`);
});
