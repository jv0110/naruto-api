require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------- routes ----------- */
const index_route = require('./src/routes/index');
const characters_route = require('./src/routes/characters_router');
const villages_route = require('./src/routes/villages_router');

app.use('/', index_route);
app.use('/', characters_route);
app.use('/', villages_route);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server started :)");
});