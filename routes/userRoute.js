const express = require('express')
const user = require('../controllers/userController')
const app = express();

//Ruta en la cual accederemos a crear el usuario
app.post('/create', user.create)

//Ruta en la cual podremos acceder al metodo de actualizar
app.put('/update/:id', user.update)
app.post('/login', user.login)

module.exports = app;