const mongoose =require('mongoose');
const Schema=mongoose.Schema;

//variable del objeto usuario
//atribustos del usuario

let user=new Schema({
    firstName:{
     type:String,
     required:[true,'userFirname is required']
    },
    lastName:{
        type:String,
        required:[true,'lastName is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    userName:{
        type:String,
        requires:[true,'userName is required']

    },
    password:{
        type:String,
        required:[true,'password is required']
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
        type: String,
        required: [true, 'favoriteList is required']
    }

});


module.exports = mongoose.model('user', user);
