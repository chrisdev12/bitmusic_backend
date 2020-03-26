const express = require('express')
const music = require('../controllers/musicController')
const app = express();

//Crear una nuevaCanción
app.post('/create', music.create);
app.get('/', music.getSongs);
app.get('/id', music.findById);
app.get('/name', music.findByName);
app.get('/typehead', music.typeHead);
app.get('/:page?', music.getSongsBypaginate);

module.exports = app;