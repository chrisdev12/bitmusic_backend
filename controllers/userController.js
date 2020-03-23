const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 

let users = {
    
    create: function (req, res) {
        //Funcion para crear el usuario
        try {
            let body = req.body
            //Usamos los campos del modelo
            let newUser = new User({
                firstName:  body.firstName,
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
    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = users
