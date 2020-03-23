const express = require('express')
const music = require('../controllers/musicController')
const app = express();

//Crear una nuevaCanción
app.post('/music/create', music.create);
app.get('/music', music.getSongs);
app.get('/music/id', music.findById);

module.exports = app;