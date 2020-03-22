const express = require('express');
const bodyParser = require('body-parser');
const musicRoute = require('./routes/songs');
const app = express();

app.use(bodyParser.json());
app.use('/api',musicRoute); //Rutas relacionadas con la música

module.exports = app;
