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
    }
}

module.exports = music