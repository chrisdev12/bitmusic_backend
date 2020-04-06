const express = require('express')
const music = require('../controllers/musicController')
const app = express();
const fileUpload = require('express-fileupload');

/**
 * @Create: Agregar datos de texto a la canción. /Create usa el middleware the fileUpload
 * @Create/update/audio/ Actualizar archivo de audio de la canción.
 * @Create/update/image/  Actualizar imagen identificadora de la canción.
 */

app.use('/create', fileUpload());
app.use('/update',fileUpload());
app.post('/create', music.create);
app.put('/update/:id', music.update);
app.get('/', music.getSongs);
app.get('/id', music.findById);
app.get('/name', music.findByName);
app.get('/typehead', music.typeHead);
app.get('/:page?', music.getSongsBypaginate);
app.get('/audio/:file', music.getAudioFile);
app.get('/image/:image', music.getImageFile);
app.delete('/delete/:songId', music.deleteSong);
module.exports = app;