const mongoose = require('mongoose')

let Schema = mongoose.Schema;


let song = new Schema({
    name: {
        type: String,
        required: [true, 'songName is required']
    },
    genre: {
        type: String,
        required: [true, 'Song genre is required']
    },
    artist: {
        type: String,
        required: [true, 'Song artist is required']
    },
    urlImage: {
        type: String,
        required: [true, 'ImageUrl of the song is required']
    },
    discName: {
        type: String,
        required: [true, 'DiscName is required']
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
        required: [true, 'audio file is required']
    }
})

module.exports = mongoose.model('song', song);