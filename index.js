require ('./config/config') //Requerir variables de entorno : Process.env.urlDb y process.env.PORT
const mongoose = require('mongoose');
const app = require('./app');

mongoose.set('useFindAndModify', false);

// Conexión a la base de datos
mongoose.connect(process.env.urlDB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
       if(err){
           console.log("Err de conexión con BD" + err);
       } else {
           console.log("Conexión exitosa a la base de datos");
           app.listen(process.env.PORT, () => {
               console.log("Escuchando en el puerto", process.env.PORT);
           });
       }
});

