const mongoose = require('mongoose')

let Schema = mongoose.Schema;


let song = new Schema({
    name: {
        type: String,
        required: [true, 'songName is required']
    },
    gender: {
        type: String,
        required: [true, 'songName is required']
    },
    artist: {
        type: String,
        required: [true, 'songName is required']
    },
    image: {
        type: String,
        required: [true, 'imageName is required']
    },
    urlImage: {
        type: String,
        required: [true, 'ImageUrl is required']
    },
    discName: {
        type: String,
        required: [true, 'songName is required']
    },
    composer: {
        type: String,
        required: [false, 'composer is required']
    },
    createAt: {
        type: Date,
        required: [true, 'publish date is required']
    },
    createdBy:{
        type: String,
        required: [true, 'Admin user is required']
    },
    audio: {
        type: String,
        required: [true, 'audio date is required']
    }
})

module.exports = mongoose.model('song', song);