const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 
const bcrypt = require('bcrypt');

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
                picture: body.picture,
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
                    user: userDB
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
        
        //Respuesta segun lo que se encuentre 
        User.findByIdAndUpdate(id, params, { new: true}, (error, userUpdated) => {
            if (error) {
                res.send({
                    message: 'Error en el servidor',
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

    delete: function (req, res) {
        var params = req.body;
        var id = req.params.id; //Importante el id, el cual utilizaremos para eliminar el usuario
        
        //Respuesta segun lo que se encuentre 
        User.findByIdAndDelete(id, params, (error, userDeleted) => {
            if (error) {
                res.send({
                    message: 'Error en el servidor',
                    statusCode: 500
                })
            } else {
                if (!userDeleted) {
                    res.send({
                        message: 'Error al eliminar el usuario',
                        statusCode: 400
                    })
                } else {
                    res.send({
                        message: 'Usuario Eliminado',
                        statusCode: 200,
                        dataUser: userDeleted
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
                    res.send({
                        message: 'Error en el servidor',
                        statusCode: 500
                    })
                }
                
                if (!userLogged) {
                    res.send({
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
                                    user: userLogged
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
    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = user
