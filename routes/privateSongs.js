const express = require('express')
const app = express();
const privateMusic = require('../controllers/privateMusicController')
const fileUpload = require('express-fileupload');
const fileValidate = require('../middlewares/fileValidation');
const token = require('../middlewares/authToken');
const userValidate = require('../middlewares/userValidation');

/**
* @create/@private son las canciones subidas por el usuario a una lista que solo puede ver el usuario uqe las sube
* @UserValidateExists valida que el usuario exista en la BD antes de poder acceder
* @fileValidatePrivateUpdate Verifica si el archivo está en el server y lo elimina en caso de que sí
* @UserValidateOwner Verifica que la canción efectivamente sea del usuario que la está pidiendo
*/

app.post('/create', [token.validation, userValidate.exist, fileUpload(), fileValidate.new], privateMusic.create)
app.put('/update/:songId', [token.validation, userValidate.exist, userValidate.owner, fileUpload(), fileValidate.privateUpdate], privateMusic.update);
app.get('/',token.validation, privateMusic.getSongs);
app.get('/name',token.validation, privateMusic.findByName);
app.get('/typehead',token.validation, privateMusic.typeHead);
app.get('/:page?',token.validation, privateMusic.getSongsBypaginate);
app.delete('/delete/:songId', [token.validation, userValidate.exist,userValidate.owner, fileValidate.delete], privateMusic.deleteSong);

module.exports = app;