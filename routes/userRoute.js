const express = require('express');
const user = require('../controllers/userController');
const app = express();
const token = require('../middlewares/authToken');
const fileUpload = require('express-fileupload');
const fileValidate = require('../middlewares/fileValidation');
const userValidate = require('../middlewares/userValidation');

/**
 * token.validarion es un middleware que valida si el token es valido, en caso de que sí,
 * se puede proceder a la funcionalidad del endpoint predefinida
 */
app.post('/create', user.create)
app.post('/login', user.login)
app.put('/update/:id', token.validation, user.update)
app.put('/saveImg/:id',[token.validation, userValidate.exist, fileUpload(), fileValidate.imageUpdate], user.saveImg)
app.put('/updatePw/:id', token.validation, user.changePassword)
app.get('/showImg/:img', token.validation, user.showImg)
app.put('/:userId', token.validation, user.addSong);
app.get('/favoriteSongs/:userId', token.validation, user.listFavoriteSong);


module.exports = app;