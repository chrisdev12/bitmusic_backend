const express = require('express')
const user = require('../controllers/userController')
const app = express();
const multipart = require('connect-multiparty');
let imgDir = multipart({ uploadDir: './assets/img/users' });
//Ruta en la cual accederemos a crear el usuario
app.post('/create', user.create)

//Ruta en la cual podremos acceder al metodo de actualizar
app.put('/update/:id', user.update)
app.post('/login', user.login)
app.put('/saveImg/:id', imgDir, user.saveImg)
app.get('/showImg/:url', user.showImg)

module.exports = app;