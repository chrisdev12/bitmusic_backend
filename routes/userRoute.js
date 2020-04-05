const express = require('express')
const user = require('../controllers/userController')
const app = express();
const multipart = require('connect-multiparty');
let imgDir = multipart({ uploadDir: './assets/img/users' });
//Ruta en la cual accederemos a crear el usuario
app.post('/create', user.create)

//Ruta en la cual podremos acceder al metodo de actualizar
app.post('/login', user.login)
app.put('/update/:id', user.update)
app.put('/saveImg/:id', imgDir, user.saveImg)
app.put('/updatePw/:id', user.changePassword)
app.get('/showImg/:img', user.showImg)
app.put('/:userId/', user.addSong)


module.exports = app;