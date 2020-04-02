const express = require('express')
const music = require('../controllers/musicController')
const app = express();
const multipart = require('connect-multiparty');
const fileUpload = require('express-fileupload');
const songImgDir = multipart({ uploadDir: './assets/img/songs' });
const songAudioDir = multipart({ uploadDir: './assets/music' });

/**
 * @Create: Agregar datos de texto a la canción. /Create usa el middleware the fileUpload
 * @Create/update/audio/ Actualizar archivo de audio de la canción.
 * @Create/update/image/ Actualizar imagen identificadora de la canción.
 */

app.use('/create',fileUpload());
app.post('/create', music.create);
// app.put('/update/audio/:id', songAudioDir, music.storeAudio);
// app.put('/update/image/:id', songImgDir, music.storeImage);
app.get('/', music.getSongs);
app.get('/id', music.findById);
app.get('/name', music.findByName);
app.get('/typehead', music.typeHead);
app.get('/:page?', music.getSongsBypaginate);

module.exports = app;