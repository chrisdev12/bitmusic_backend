const express = require('express')
const music = require('../controllers/musicController')
const app = express();

//Crear una nuevaCanción
app.post('/music/create', music.create);
app.get('/music', music.getSongs);
app.get('/music/:page?', music.getSongsBypaginate);

module.exports = app;