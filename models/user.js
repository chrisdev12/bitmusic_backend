const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

/*
* @unique: Validate that the username and email are not repeated.
* @enum: Only allow the entry/post of pre-established roles in
* allowRoles.values
* Note: Role is set by default as USER, no one should be able 
* to inject any other kind of role from the frontend
*/

const allowRoles = {
    values: ['USER'] ,
    message: '{VALUE} no es un rol válido'
}

let user = new Schema({

    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role:{
        type: String,
        default: 'USER',
        enum: allowRoles
    },
    image: {
        type: String,
        required:  false
    },
    phone: {
        type: Number,
        required: false
    },
    favoriteSongs: {
        type: Array,
        required: false
    }
});

/*
* @methods.toJSON = This method is always used for mongoose
* when is trying to print a response. Here is used to avoid a security issue:
* Don't return the password in the server response if the user was successfull 
* created
*/

user.methods.toJSON = function () {
    let user = this;
    let userValidation = user.toObject();
    
    //delete the password of the response (res.send)
    delete userValidation.password
    return userValidation
}

user.plugin(uniqueValidator, { message: '{PATH} is already registered, try with another one'})

module.exports = mongoose.model('user', user);