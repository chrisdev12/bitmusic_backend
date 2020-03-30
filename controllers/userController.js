const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path')
const publicUserImg = path.join(__dirname,'../assets/img/users')

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
                password: bcrypt.hashSync(body.password,10), 
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
            params.password = bcrypt.hashSync(params.password,10)
        }
        
        //Respuesta segun lo que se encuntre 
        User.findByIdAndUpdate(id, params, { new:true }, (err, userUpdated) => {
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
        if (req.files) {
            let imgName = req.files.image.path.split('//');
            console.log('image1:',imgName);
           
            if (imgName.length === 1) {
                imgName = req.files.image.path.split('/')[0];
                console.log('image2:',imgName);
            }
            
            User.findByIdAndUpdate(id, { image: imgName },(err, userAndimgUpdated) => {
                if (err) {
                    return res.send({
                        statusCode: 500,
                        ok: false,
                        message: 'Sever error'
                    })
                }
                
                if (userAndimgUpdated) {
                    return res.send({
                        statusCode: 200,
                        ok: true,
                        dataUser: userAndimgUpdated,
                        img: imgName
                    })
                } else {
                    return res.send({
                        statusCode: 401,
                        ok: false,
                        message: 'User not found'
                    }) 
                }           
            })
        } else {
            return res.send({
                statusCode: 400,
                ok: false,
                message: 'Sever error || Any file was upload'
            })
        }
    },
    showImg: function (req, res) {
        let url = req.params.url
        console.log(`${publicUserImg}${url}`)
        res.sendFile(`${publicUserImg}//${url}`)
    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = user
