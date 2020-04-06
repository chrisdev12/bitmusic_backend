// Puerto
process.env.PORT = process.env.PORT || 3000;

// Host de base de datos según entorno. 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = 'mongodb+srv://bictiaMusic:bictiaMusic@cluster0-femc7.mongodb.net/bictiaMusic?retryWrites=true&w=majority'

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/bictiaMusic'
// } else {
//     urlDB = 'mongodb+srv://bictiaMusic:bictiaMusic@cluster0-femc7.mongodb.net/test?retryWrites=true&w=majority'
// }

process.env.urlDB = urlDB //Process.env es una variable global