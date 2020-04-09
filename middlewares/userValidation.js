const User = require('../models/user');

let user = {
    
    exist: function (req, res, next) {
        
        let userId = req.body.id;
        User.findById(userId).exec((err, user) => {
            if (err) {
                return res.send({
                    statusCode: 500,
                    message: 'Error en el servidor'
                });
            }
            if (!user) {
                return res.send({
                    statusCode: 400,
                    message: 'No existe el usuario al que se le desea agregar la canción'
                });
            } else {
                req.body.user = user;
                next()
            }
        })
    },
    owner: function (req,res, next){
        let songsUploaded = req.body.user.uploadedSongs;
        let songRequired = req.params.songId
        
        if (songsUploaded.includes(songRequired)) {
            next()
        } else {
           return res.send({
                statusCode: 402,
                message: 'Recurso no disponible. Verifique su usuario o contraseña'
            }); 
        }
    }
}

module.exports = user