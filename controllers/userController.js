const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path')

let user = {
    
    create: function (req, res) {
        //Funcion para crear el usuario
        try {
            let body = req.body
            //Usamos los campos del modelo
            let newUser = new User({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: bcrypt.hashSync(body.password, 10),
                role: body.role,
                image: body.image,
                phone: body.phone,
                favoriteSongs: body.favoriteList
            })

            newUser.save((err, userDB) => {
                if (err) {
                    return res.send({
                        statusCode: 400,
                        ok: false,
                        err: `Error al agregar el usuario:  ${err}`
                    })
                }
                
                return res.send({
                    statusCode: 200,
                    ok: true,
                    dataUser: userDB
                })
            })
        } catch (error) {
            res.send({
                ok: false,
                error: error
            })
        }
    },

    //Funcion para actualizar el usuario
    update: function (req, res) {
        var params = req.body;
        var id = req.params.id; //Importante el id, el cual utilizaremos para actualizar el usuario
        
        if (params.password) {
            params.password = bcrypt.hashSync(params.password, 10)
        }
        
        //Respuesta segun lo que se encuntre 
        User.findByIdAndUpdate(id, params, { new: true }, (err, userUpdated) => {
            if (err) {
                res.send({
                    message: 'Error en el servidor a la hora de guardar la imagen',
                    statusCode: 500
                })
            } else {
                if (!userUpdated) {
                    res.send({
                        message: 'Error al actualizar el usuario',
                        statusCode: 400
                    })
                } else {
                    res.send({
                        message: 'Usuario actualizado',
                        statusCode: 200,
                        dataUser: userUpdated
                    })
                }
            }
        })
    },
    
    //Funcion para validar loging de usuarios
    login: function (req, res) {
        
        let body = req.body;
        User.findOne({ email: body.email },
            (error, userLogged) => {
                if (error) {
                    return res.send({
                        message: 'Error en el servidor',
                        statusCode: 500
                    })
                }
                
                if (!userLogged) {
                    return res.send({
                        menssage: 'El usuario no existe',
                        statusCode: 400
                    })
                } else {
                    bcrypt.compare(body.password, userLogged.password,
                        (err, check) => {
                            //Si es correcto,
                            if (check) {
                                // Devolver los datos
                                return res.send({
                                    menssage: 'Usuario logueado',
                                    statusCode: 200,
                                    dataUser: userLogged
                                });
                            } else {
                                return res.send({
                                    message: 'Los datos no son correctos',
                                    statusCode: 401
                                })
                            }
                        }
                    )
                }
            }
        )
    },
    saveImg: function (req, res) {
        
        let id = req.params.id;
        
        let img = req.files.image.path;
    
        User.findByIdAndUpdate(id, { image: img }, {new: true}, (err, userAndimgUpdated) => {
            if (err) {
                return res.send({
                    statusCode: 500,
                    ok: false,
                    message: 'Sever error al agregar imagen'
                })
            }
            
            if (userAndimgUpdated) {
                userAndimgUpdated.image = userAndimgUpdated.image.split('\\')[3]
                return res.send({
                    statusCode: 200,
                    ok: true,
                    dataUser: userAndimgUpdated
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
    showImg: function (req, res) {
        let img = req.params.img
        let nameImage = img === 'undefined' ? '404.png' : img;
        let imageRoute = `./assets/img/users/${nameImage}`;
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
    changePassword: function(req, res){
        let id = req.params.id;
        let password = bcrypt.hashSync(req.body.password, 10);
        
        User.findByIdAndUpdate(id, { password: password }, (err, pwUpdated) => {
             
            if (err) {
                return res.send({
                    statusCode: 500,
                    message: 'Server error'
                })
            }
            if (!pwUpdated) {
                return res.send({
                    statusCode: 401,
                    message: 'Ningún usuario encontrado'
                })
            } else {
                return res.send({
                    statusCode: 200,
                    message: 'contraseña actualizada'
                })
            }
         })
        
    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = user
