const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const app = express();

app.use(bodyParser.json());



module.exports = app;
