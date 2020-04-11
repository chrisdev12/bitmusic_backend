const Song = require('../models/music');
const fs = require('fs');
const path = require('path')
const _ = require('underscore') //Validar que campos son los que dejaremos actualizar en cada Endpoint

let music = {
    
    create: function (req, res) {
            
        let body = req.body;
        let audio = req.files.audio;
        let image = req.files.image;
            
        // Usaremos nuestro Schema apra agregrar la nueva canción
        let newSong = new Song({
            name:  body.name,
            genre: body.genre,
            artist: body.artist,
            discName: body.discName,
            composer: body.composer,
            createAt: body.createAt,
            audio: body.audio,
            urlImage: body.urlImage,
        })
        
        newSong.save((err, songDB) => {
            if (err) {
                res.status(400).send({
                    statusCode: 400,
                    ok: false,
                    message: 'Error al agregar nueva canción' + err
                })
            } else {
                
                // Si todo ha salido bien usaremos .mv() para mover archivos a los folders deseados. Y validamos si necesitamos guardar
                // algo para imagen o usamos 404 en su defecto
                if (image) {
                    image.mv(`./assets/img/songs/${body.urlImage}`, function (err) {
                        if (err) {
                            return res.send({
                                statusCode: 500,
                                ok: false,
                                message: 'Error en los archivos de imagen-canción'
                            });
                        }
                    });  
                }

                audio.mv(`./assets/music/${body.audio}`, function (err) {
                    if (err) {
                        return res.send({
                            statusCode: 500,
                            ok: false,
                            message: 'Error en los archivos de audio'
                        });
                    }
                });
                
                res.status(200).send({
                    statusCode: 200,
                    ok: true,
                    message: songDB
                }) 
            }    
        })
    
    }, 
    update: function (req, res) {
        
        let id = req.params.songId;
        let params = req.body;
        let audio
        let image
        
        if (req.files) {
            audio = req.files.audio;
            image = req.files.image; 
        }
        Song.findByIdAndUpdate(id, params, { new: true }, (err, songUpdated) => {
            if (err) {
                return res.send({
                    statusCode: 500,
                    ok: false,
                    message: 'Sever error al actualizar canción'
                })
            }
        
            if (songUpdated) {
                
                if (image) {
                    image.mv(`./assets/img/songs/${params.urlImage}`, function (err) {
                        if (err) {
                            return res.send({
                                statusCode: 500,
                                ok: false,
                                message: 'Error en la subida de archivos de imagen-canción'
                            });
                        }
                    });
                }    
                if (audio) {
                    audio.mv(`./assets/music/${params.audio}`, function (err) {
                        if (err) {
                            return res.send({
                                statusCode: 500,
                                ok: false,
                                message: 'Error en la subida de archivos de audio'
                            });
                        }
                    });
                }   
                return res.send({
                    statusCode: 200,
                    ok: true,
                    song: songUpdated
                })
            } else {
                return res.send({
                    statusCode: 401,
                    ok: false,
                    message: 'Song not found'
                })
            }
        })      
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
        
        let id = req.params.songId
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
        });
    },
    findByName: function (req, res) {

        let name = req.body.name;
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
        
        let name = req.query.name
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
    getSongsBypaginate: function (req, res) {
        
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
    },
    getAudioFile: function (req, res) {
        
        let song = req.params.file
        let songRoute = `./assets/music/${song}`;
        if (fs.existsSync((songRoute))){
            res.sendFile(path.resolve(songRoute));
        } else {
            res.send({
                statusCode: 400,
                ok: false,
                message: 'No se encontro la canción'
            });
        }
    },
    getImageFile: function (req, res) {
        
        let image = req.params.image
        let imageRoute = `./assets/img/songs/${image}`;
        if (fs.existsSync((imageRoute))){
            res.sendFile(path.resolve(imageRoute));
        } else {
            res.send({
                statusCode: 400,
                ok: false,
                message: 'No se encontro la imagen'
            });
        }
    },
    deleteSong: function(req, res){
        let songId = req.params.songId;

        Song.findByIdAndDelete(songId, (err, songDeleted)=> {
            if(err){
                return res.send({
                    statusCode: 500,
                    message: 'Error en el servidor'
                });
            }
            if(!songDeleted){
                return res.send({
                    statusCode: 400,
                    message: 'Error al eliminar la canción'
                });
            }

            return res.send({
                statusCode: 200,
                message: 'Canción eliminada correctamente',
                song: songDeleted
            });
        });
    }
}

module.exports = music;