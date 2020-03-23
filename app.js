const express = require('express');
const bodyParser = require('body-parser');
const musicRoute = require('./routes/songs');
const userRoute = require('./routes/userRoute');
const app = express();

app.use(bodyParser.json());
app.use('/api',musicRoute); //Rutas relacionadas con la música
app.use('/api',userRoute); //Rutas relacionada para el usuario

module.exports = app;
