const Song = require('../models/music');

let music = {
    
    create: function (req, res) {
        //Agregar nueva canción a la base de datos
        try {
            let body = req.body
            //Usando modelo de nueva canción
            let newSong = new Song({
                name:  body.name,
                genre: body.genre,
                artist: body.artist,
                urlImage: body.urlImage,
                discName: body.discName,
                composer: body.composer,
                createAt: body.createAt,
                createdBy: body.createdBy,
                audio: body.audio
            })
            
            newSong.save((err, songDB) => {
                if (err) {
                    res.status(400).send({
                        statusCode: 400,
                        ok: false,
                        err: 'Error al agregar nueva canción' + err
                    })
                } else {
                    res.status(200).send({
                        statusCode: 200,
                        ok: true,
                        created: songDB
                    }) 
                }    
            })
        } catch (error) {
            console.log(error)
        }
    },
    getSongs: function(req, res){
        Song.find().exec((err, songs) => {
            if(err || !songs) {
                return res.status(400).send({
                    statusCode: 400,
                    status : 'error',
                    message: 'No hay canciones existentes'
                });
            }
            return res.status(200).send({
                statusCode: 200,
                status: 'success',
                music: songs
            });
        });
    },
    findById: function (req, res) {
        
        let id = req.body.id
        Song.findById(id, (err, songFound) => {
            if (err || !songFound) {
                return res.status(400).send({
                    message: 'La canción no existe o fue eliminada de la BD',
                    statusCode: 400
                })
            }  
            return res.status(200).send({
                statusCode: 200,
                status: 'success',
                song: songFound
            });
        })
    }
}

module.exports = music;