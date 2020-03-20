const express = require('express')
const music = require('../controllers/music/addSong')
const app = express();

//Crear una nuevaCanción
app.post('/music/create', music.create)

module.exports = app;