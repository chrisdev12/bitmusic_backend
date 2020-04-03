const Song = require('../models/music');

let music = {
    
    create: function (req, res) {
        
        /**
        * fileUpload() está como middleware de todo lo que entre por /create- Por lo cual primeros haremos la recuperación
        * de los archivos. Validaremos cúales vienen (audio es requerido, mientras imagen no) y luego usaremos el modelo para
        * la anueva canción a la base de datos, y si todo sale bien guardaremos los archivos en su respectivo directorio.
        * Nota: El middleware nos "parseara" o devolvera 3 cosas: 2 archivos y un JSON con el nombre body.
        */
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.send({
                statusCode: 400,
                ok: false,
                message: 'Ningún archivo fue seleccionado/enviado'
            });
        }
        
        // Nombre enviado en el req / Usado para recuperar el archivoy nombre con el que se guardara
        let image = req.files.image
        let audio = req.files.audio
        let audioName
        let imageName
        
        if(req.files.audio)
        
        if (audio) {
            audioName = encryptName(req.files.audio.name);   
        } else {
            return res.send({
                statusCode: 400,
                ok: false,
                message: 'No se selecciono ningúna archivo de audio. Se necesita una para crear la canción'
            });
        }
        
        if (image) {
            imageName = encryptName(req.files.image.name);   
        }
    
        function encryptName(filename) {
            // Recuperar extensión del archivo
            let name = filename.split('.').shift()
            let ext = filename.split('.').pop()
            //Aleatorización nombre y concatenarle la extensión que traía   
            let random = Math.random();
            let randomName = random + name + new Date().getMilliseconds()
            return `${randomName}.${ext}`
        }
        
        // A diferencias de otros request, como este fue enviado desde el front dentro de un formData, debemos primero usar JSON.parse
        // Usaremos nuestro Schema apra agregrar la nueva canción
            let body = JSON.parse(req.body.body)
            let newSong = new Song({
                name:  body.name,
                genre: body.genre,
                artist: body.artist,
                discName: body.discName,
                composer: body.composer,
                createAt: body.createAt,
                createdBy: body.createdBy,
                audio: audioName,
                urlImage: imageName,
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
                        image.mv(`./assets/img/songs/${imageName}`, function (err) {
                            if (err) {
                            return res.send({
                                    statusCode: 500,
                                    ok: false,
                                    message: 'Error en los archivos de imagen-canción'
                                });
                            }
                        });  
                    }
 
                    audio.mv(`./assets/music/${audioName}`, function (err) {
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
    
    updateAudio: function (req, res) {
        
        let id = req.params.id;
        let audio = req.files.image.path;
        
        Song.findByIdAndUpdate(id, { audio: audio }, { new: true }, (err, audioUpdated) => {
            if (err) {
                return res.send({
                    statusCode: 500,
                    ok: false,
                    message: 'Sever error al agregar imagen'
                })
            }
        
            if (audioUpdated) {
                return res.send({
                    statusCode: 200,
                    ok: true,
                    dataUser: audioUpdated
                })
            } else {
                return res.send({
                    statusCode: 401,
                    ok: false,
                    message: 'User not found'
                })
            }
        })
        
    },
    
    updateImage: function (req, res) {
        let id = req.params.id;
        let img = req.files.image.path;
        
        Song.findByIdAndUpdate(id, { urlImage: img }, { new: true }, (err, imgUpdated) => {
            if (err) {
                return res.send({
                    statusCode: 500,
                    ok: false,
                    message: 'Sever error al agregar imagen'
                })
            }
        
            if (imgUpdated) {
                return res.send({
                    statusCode: 200,
                    ok: true,
                    dataUser: imgUpdated
                })
            } else {
                return res.send({
                    statusCode: 401,
                    ok: false,
                    message: 'User not found'
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