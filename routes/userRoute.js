const express = require('express')
const user = require('../controllers/userController')
const app = express();

//Ruta en la cual accederemos a crear el usuario
app.post('/user/create', user.create),
//Ruta en la cual podremos acceder al metodo de actualizar
app.put('/user/update/:id', user.update)
module.exports = app;