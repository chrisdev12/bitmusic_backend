const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 

let users = {

    create: function (req, res) {
        //Funcion para crear el usuario
        try {
            let body = req.body
            //Usamos los campos del modelo
            let newUser = new User({
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                email: body.email,
                userName: body.userName,
                password: body.password,
                picture: body.picture,
                rol: body.rol,
                favoriteList: body.favoriteList
            })

            newUser.save((err, userDB) => {
                if (err) {
                    res.status(400).send({
                        statusCode: 400,
                        ok: false,
                        err: 'Error al agregar el usuario' + err
                    })
                } else {
                    res.status(200).send({
                        statusCode: 200,
                        ok: true,
                        created: userDB
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    },

    update: function (req, res) {
        var params = req.body;
        var id = req.params.id;
        
        User.findByIdAndUpdate(id, params, (error, userUpdated) => {
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




    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = users
