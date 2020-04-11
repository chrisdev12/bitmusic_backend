const express = require('express')
const music = require('../controllers/musicController')
const app = express();
const fileUpload = require('express-fileupload');
const token = require('../middlewares/authToken');
const fileValidate = require('../middlewares/fileValidation');

/**
* @Create y @update usan el middleware the fileUpload() para obtener de forma sencilla los archivos.
* @Create usa fileValidate.new para randomizar los nombres y enviar de forma sencilla todos los campos para agregar al modelo en el req.body
* @token es un middleware con dos métodos: validation y adminValidation. Validation se genera sobre todos los endpoints y admin
* solo sobre los que necesitan permisos de admin para ejecutarse.
* @Create y @update usan token.admin
*/

app.post('/create',[token.validation, token.adminValidation, fileUpload(), fileValidate.new], music.create);
app.put('/update/:songId', [token.validation, token.adminValidation, fileUpload(), fileValidate.update], music.update);
app.get('/', token.validation, music.getSongs);
app.get('/typehead',token.validation, music.typeHead);
app.get('/:songId', token.validation, music.findById);
app.get('/name',token.validation, music.findByName);
app.get('/:page?',token.validation, music.getSongsBypaginate);
app.get('/audio/:file',token.validation, music.getAudioFile);
app.get('/image/:image',token.validation, music.getImageFile);
app.delete('/delete/:songId', [token.validation, token.adminValidation, fileValidate.delete], music.deleteSong);

module.exports = app;