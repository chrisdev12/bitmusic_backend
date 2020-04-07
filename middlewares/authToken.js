const jwt = require('jsonwebtoken');

let token = {
    
    validation: (req, res, next) => {
        let token = req.get('token');
        jwt.verify(token, 'secret-bictia', (err, decoded) => {
            if (err) {
                return res.send({
                    statusCode: 401,
                    ok: false,
                    err: 'Acceso denegado, compruebe sus credenciales'
                })
            }
            req.user = decoded.user; //User fue lo que codificamos cuando encriptamos y creamos el Token
            next();
        })
    },  
    adminValidation: (req, res, next) => {
        let role = req.user.role
        
        if (role === 'ADMIN') {
            next();
        } else {
            return res.send({
                statusCode: 401,
                ok: false,
                message: 'El usuario no tiene los permisos para está acción'
            })
        }   
    }
}

module.exports = token