const express = require('express')
const user = require('../controllers/userController')
const app = express.Router;

app.post('/user/create', user.create);//Crear ususario
console.log("entramos")

module.exports = app;//exportacion de todos los modulos