const Song = require('../models/music');
const fs = require('fs');
const path = require('path')

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
    },
    findByName: function (req, res) {
        
        let name = req.body.name
        Song.find({ 'name' : name }).exec((err, coincidences) => {
            if (err) {
                return res.status(500).send({
                    message: `Error en el servidor: ${err}`,
                    statusCode: 500
                })
            } else if (coincidences.length === 0) {
                return res.status(400).send({
                    message: 'No se encontraron canciones con ese nombre',
                    statusCode: 400
                })
            } else {
                return res.status(200).send({
                    statusCode: 200,
                    status: 'success',
                        songs: coincidences
                    })
            }       
        })
    },
    typeHead: function (req, res) {
        let name = req.body.name
        Song.find({
            'name': {
                "$regex": `${name}`,
                "$options": "i"
            }
        }).exec((err, coincidences) => {
            if (err) {
                return res.status(500).send({
                    message: `Error en el servidor: ${err}`,
                    statusCode: 500
                })
            } else if (coincidences.length === 0) {
                return res.status(400).send({
                    message: 'No se encontraron canciones con ese nombre',
                    statusCode: 400
                })
            } else {
                return res.status(200).send({
                    statusCode: 200,
                    status: 'success',
                    songs: coincidences
                })
            }
        })
    },     
    getSongsBypaginate: function(req,res){
        if(!req.params.page || req.params.page == '0' || req.params.page == 0 || req.params.page == undefined){
            var page = 1; 
        } else {
            var page = parseInt(req.params.page);
        }
        var options = {
            sort: {date: -1},
            limit: 6,
            page: page
        };
        Song.paginate({}, options, (err, songs) => {
            if(err) {
                return res.status(500).send({
                    statusCode: 500,
                    status: 'error',
                    message: "Error al consultar"
                });
            }
            if(!songs) {
                return res.status(400).send({
                    statusCode: 400,
                    status: 'error',
                    message: 'No existen canciones'
                });
            }
            return res.status(200).send({
                statusCode: 200,
                status: songs.docs,
                totalDocs: songs.totalDocs,
                totalPages: songs.totalPages
            });
        });
    }
}

module.exports = music;