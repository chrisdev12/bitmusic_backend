const express = require('express')
const user = require('../controllers/userController')
const app = express();

//Ruta en la cual accederemos a crear el usuario
app.post('/create', user.create)

module.exports = app;