const express = require('express');
const bodyParser = require('body-parser');
const musicRoute = require('./routes/songs');
const privateMusicRoute = require('./routes/privateSongs');
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors({origin: '*'})) //Cabeceras
app.use('/api/music', musicRoute); //Rutas relacionadas con la música
app.use('/api/music/private', privateMusicRoute); //Rutas relacionadas con la música privada (subida por cada usuario)
app.use('/api/user', userRoute); //Rutas relacionada para el usuario

module.exports = app

