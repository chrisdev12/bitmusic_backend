const express = require('express');
const bodyParser = require('body-parser');
const musicRoute = require('./routes/songs');
const userRoute = require('./routes/userRoute');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next ) =>{
    res.header('Access-Control-Allow-Origin', '*')
    
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Content-Type, Accept, Access-Control-Allow-Request-Method')
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS' )
    
    next();
})

app.use('/api/music',musicRoute); //Rutas relacionadas con la música
app.use('/api/user', userRoute); //Rutas relacionada para el usuario

module.exports = app

