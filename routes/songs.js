const express = require('express')
const music = require('../controllers/musicController')
const app = express();
const fileUpload = require('express-fileupload');
const token = require('../middlewares/authToken')

/**
 * @Create y @update usa el middleware the fileUpload() para obtener de forma sencilla los File
 * @token es un middleware con dos métodos: validation y adminValidation. Validation se genera sobre todos los endpoints y admin
 * solo sobre los que necesitan permisos de usuario para ejecutarse.
 * @Create y @update usan token.admin
 */

app.use('/create', fileUpload());
app.use('/update',fileUpload());
app.post('/create',[token.validation, token.adminValidation], music.create);
app.put('/update/:id',[token.validation, token.adminValidation], music.update);
app.get('/',token.validation, music.getSongs);
app.get('/id', token.validation, music.findById);
app.get('/name',token.validation, music.findByName);
app.get('/typehead',token.validation, music.typeHead);
app.get('/:page?',token.validation, music.getSongsBypaginate);
app.get('/audio/:file',token.validation, music.getAudioFile);
app.get('/image/:image',token.validation, music.getImageFile);
app.delete('/delete/:songId',[token.validation, token.adminValidation], music.deleteSong);
module.exports = app;