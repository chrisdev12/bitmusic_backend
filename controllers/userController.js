const User = require('../models/user');  //Importamos el modelo con el cual interactuaremos 
const bcrypt = require('bcrypt');

let user = {
    
    create: function (req, res) {
        //Funcion para crear el usuario
        try {
            let body = req.body
            //Usamos los campos del modelo
            let newUser = new User({
                firstName:  body.firstName,
                lastName: body.lastName,
                email: body.email,
                username: body.username,
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
    }
}

//Exportamos lo que contiene la funcion en este caso users
module.exports = user
