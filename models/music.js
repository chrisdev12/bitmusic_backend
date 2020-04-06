const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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
        default: '404.png',
    },
    discName: {
        type: String,
        required: [true, 'DiscName is required']
    },
    composer: {
        type: String,
        required: false
    },
    createAt: {
        type: Date,
        required: [true, 'publish date is required']
    },
    createdBy:{
        type: String,
    },
    audio: {
        type: String,
        required: [true, 'Audio file is required']
    }
})
song.plugin(mongoosePaginate);

module.exports = mongoose.model('song', song);