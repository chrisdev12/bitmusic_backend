const User = require('../models/user');//Importamos el  modelo
const crypto = require('crypto');//npm isntall crypto --save

let user = {

    create: function (req, res) {
        //Agregar nueva canción a la base de datos
        try {
            let body = req.body
            //Usando modelo de nueva canción
            let newUser = new User({
                firsName: body.firsName,
                lastName: body.lastName,
                email: body.email,
                userName: body.userName,
                password: body.password,
                picture:body.picture,
                rol:body.rol,
                favoriteList:body.favoriteList
            })

            newUser.save((err, userDB) => {
                if (err) {
                    res.status(400).send({
                        statusCode: 400,
                        ok: false,
                        err: 'Error al agregar nueva canción' + err
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

    login: function (req, res) {
        let body = req.body;
        User.findOne({ userName: body.userName },
            (error, userLogged) => {
                if (error) {
                    res.status(500).send({
                        message: 'Error en el servidor',
                        statusCode: 500
                    })
                } else {
                    if (!userLogged) {
                        res.status(400).send({
                            menssage: 'El usuario no existe',
                            statusCode: 400

                        })
                    } else {
                        let password = Crypto(body.password)
                        if (password === userLogged.password) {
                            res.status(200).send({
                                menssage: 'Los datos son correctos',
                                statusCode: 200
                            })

                        } else {
                            res.status(401).send({
                                message: 'Los datos no son correctos',
                                statusCode: 401
                            })

                        }

                    }

                }

            })
    }
}
function Crypto(password) {
    console.log('esta', password)
    let algorithm = 'aes-256-cbc';
    let key = crypto.createCipher(algorithm, password);
    let encriptedPass = key.update(password, 'utf8', 'hex');
    encriptedPass += key.final('hex');
    console.log(encriptedPass);
    return encriptedPass


}

module.exports = user