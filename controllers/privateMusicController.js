const PrivateSong = require('../models/privateMusic');
const User = require('../models/user');
const mongoose = require('mongoose');

let music = {
    
    create: function (req, res) {
            
        let body = req.body;
        let audio = req.files.audio;
        let image = req.files.image;
        
        // Usaremos nuestro Schema apra agregrar la nueva canción
        let newPrivSong = new PrivateSong({
            name: body.name,
            genre: body.genre,
            artist: body.artist,
            discName: body.discName,
            composer: body.composer,
            createAt: body.createAt,
            createdBy: body.id,
            audio: body.audio,
            urlImage: body.urlImage,
        })
        
        newPrivSong.save((err, songDB) => {
            if (err) {
                res.status(400).send({
                    statusCode: 400,
                    ok: false,
                    message: 'Error al agregar nueva canción' + err
                })
            } else {
                
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
                
                let songId = mongoose.Types.ObjectId(songDB._id);
                let uploadedSongs = req.body.user.uploadedSongs;
                uploadedSongs.push(songId);
                
                User.findByIdAndUpdate(body.id, { uploadedSongs: uploadedSongs },{ new: true }, (err,user) => {
                    if (err) {
                        return res.send({
                            statusCode: 500,
                            error: err
                        });
                    }
                    return res.send({
                        status: 200,
                        ok: true,
                        user,
                        songDB
                    });
                });
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
        PrivateSong.findByIdAndUpdate(id, params, { new: true }, (err, songUpdated) => {
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
        let owner = req.body.id
        PrivateSong.find({ 'createdBy' : owner }).exec((err, songs) => {
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
    findByName: function (req, res) {
        
        let owner = req.body.id
        let name = req.body.name;
        PrivateSong.find({ 'name' : name,'createdBy' : owner }).exec((err, coincidences) => {
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
        
        let owner = req.body.id
        let name = req.query.name
        PrivateSong.find({
            'name': {
                "$regex": `${name}`,
                "$options": "i"
            },
            'createdBy' : owner
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
        PrivateSong.paginate({}, options, (err, songs) => {
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
    deleteSong: function(req, res){
        let songId = req.params.songId;

        PrivateSong.findByIdAndDelete(songId, (err, songDeleted)=> {
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
            
            let newList = req.body.user.uploadedSongs.filter( song => song != songId); //Eliminar canción de la lista de subidas

            User.findByIdAndUpdate(req.body.id, { uploadedSongs: newList }, { new: true }, (err,user) => {
                if (err) {
                    return res.send({
                        statusCode: 500,
                        error: err
                    });
                }
                return res.send({
                    status: 200,
                    ok: true,
                    message: 'Canción eliminada correctamente',
                    user
                });
            });
        });
        
    }
}

module.exports = music;