const express = require('express')
const music = require('../controllers/musicController')
const app = express();

//Crear una nuevaCanción
app.post('/music/create', music.create);
app.get('/music', music.getSongs);
app.get('/music/id', music.findById);
app.get('/music/name', music.findByName);
app.get('/music/typehead', music.typeHead);
app.get('/music/:page?', music.getSongsBypaginate);

module.exports = app;