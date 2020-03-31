const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//**
//Campos los cuales tendra la base de datos
//
let user = new Schema({

    firstName: {
        type: String,
        required: [true, 'firstName is required']
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    userName: {
        type: String,
        required: [true, 'userName is required']
    },
    password: {
        type: String,
        required: [false, 'password is required']
    },
    picture: {
        type: String,
        required: [true, 'picture is required']
    },
    rol:{
        type: String,
        required: [true, 'rol is required']
    },
    favoriteList: {
        type: [],
        required: [true, 'favoriteList is required']
    }

});

//Se exporta este modulo con el nombre que recibio en la parte superior

module.exports = mongoose.model('user', user);