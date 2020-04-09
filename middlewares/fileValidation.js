const Song = require('../models/music');
const PrivateSong = require('../models/privateMusic');
const fs = require('fs');
const imagePath = './assets/img/songs/';
const audioPath = './assets/music/';

let file = {  
    
    new: function (req, res, next) {
        
        //Validar si el body viene por el req.body(postman) o req.body.body(Angular) 
        req.body = req.body || JSON.parse(req.body.body)    
        
        /**
        * fileUpload() es el primer middleware, nos devuelve los archivos en el req.file y nos devuelve el body en req.body
        * si usamos postman o req.body.body si usamos el servicio de angular.
        */   
        if(!req.files || Object.keys(req.files).length === 0) {
            return res.send({
                statusCode: 400,
                ok: false,
                message: 'Ningún archivo fue seleccionado/enviado'
            });
        }   
        
        /**
        * Audio es obligatorio, imagen no. Les asignaremos el nombre randomizado
        * mediante la función randomizeName declara al final.
        */  
        if (req.files.audio) {
            req.body.audio = randomizeName(req.files.audio.name);   
        } else {
            return res.send({
                statusCode: 400,
                ok: false,
                message: 'No se selecciono ningúna archivo de audio. Se necesita una para crear la canción'
            });
        }     
        if (req.files.image) {
            req.body.urlImage  = randomizeName(req.files.image.name);   
        }  
        
        next();
    },
    update: async function (req, res, next) {
        
        //Validar si el body viene por el req.body(postman) o req.body.body(Angular) 
        try {
            req.body = req.body || JSON.parse(req.body.body)
        
            if (req.files) {
            
                let id = req.params.songId;
                //Buscar datos actuales de la canción: Queremos recuperar audio e imagen actual.
                let oldFile = await Song.findById
                    (id, (err, song) => {
                        if (song) {
                            return song
                        } 
                    });
            
                //Validar cuales archivos vinieron y eliminar el archivo viejo en caso de que exista.
                if (req.files.image) {
                    trashOldFile(oldFile.urlImage,imagePath)
                    req.body.urlImage = randomizeName(req.files.image.name);
                }       
                if (req.files.audio) {
                    trashOldFile(oldFile.audio,audioPath)
                    req.body.audio = randomizeName(req.files.audio.name);
                }  
            }

            next()
            
        } catch (err) {           
            return res.send({
                statusCode: 500,
                ok: false,
                message: 'Sever error al actualizar canción. Verifique que exista'
            })                
        }
    },
    
    privateUpdate: async function (req, res, next) {
        
        //Validar si el body viene por el req.body(postman) o req.body.body(Angular) 
        try {
            req.body = req.body || JSON.parse(req.body.body)
        
            if (req.files) {
            
                let id = req.params.songId;
                //Buscar datos actuales de la canción: Queremos recuperar audio e imagen actual.
                let oldFile = await PrivateSong.findById
                    (id, (err, song) => {
                        if (song) {
                            return song
                        } 
                    });
            
                //Validar cuales archivos vinieron y eliminar el archivo viejo en caso de que exista.
                if (req.files.image) {
                    trashOldFile(oldFile.urlImage,imagePath)
                    req.body.urlImage = randomizeName(req.files.image.name);
                }       
                if (req.files.audio) {
                    trashOldFile(oldFile.audio,audioPath)
                    req.body.audio = randomizeName(req.files.audio.name);
                }  
            }

            next()
            
        } catch (err) {           
            return res.send({
                statusCode: 500,
                ok: false,
                message: 'Sever error al actualizar canción. Verifique que exista'
            })                
        }
    },
    delete: function (req, res, next) {
        let songId = req.params.songId;
        PrivateSong.findById(songId,(err, oldFile) => {
            if(err || !oldFile) {
                return res.status(400).send({
                    statusCode: 400,
                    status : 'error',
                    message: 'La canción que deseas eliminar no existe.'
                });
            }
            
            if (oldFile.urlImage) {              
                trashOldFile(oldFile.urlImage,imagePath)
            }       
            if (oldFile.audio) {
                trashOldFile(oldFile.audio,audioPath)
            }
            next();
        });
    }
}

function trashOldFile(file,path) {
    if (fs.existsSync((`${path}${file}`))){
        fs.unlink(`${path}${file}`, (err) => {
            if (err) {
                throw new Error(err)
            }
        })
    }
}

function randomizeName(filename) {
    // Recuperar extensión del archivo
    let name = filename.split('.').shift()
    let ext = filename.split('.').pop()
    //Aleatorización nombre y concatenarle la extensión que traía   
    let random = Math.random();
    let randomName = random + name + new Date().getMilliseconds()
    return `${randomName}.${ext}`
}

module.exports = file

