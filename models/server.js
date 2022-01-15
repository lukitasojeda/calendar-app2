const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config')



class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:        '/api/auth',
            eventos:  '/api/events',
            users:      '/api/users',
        }

        //Conectar a base de datos.
        this.conectarDB();
        //Middlewares (Funciones que se ejecutan cuando se levanta el servidor.)
        this.middlewares();
        //Rutas de mi aplicación.
        this.routes();
    };

    async conectarDB(){
        await dbConnection()
    };

    middlewares(){
        //CORS
        this.app.use( cors() );
        //Lectura y parseo del body.
        this.app.use( express.json() );
        //Directorio público.
        this.app.use( express.static('public') );
        //FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    };

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
        this.app.use(this.paths.eventos, require('../routes/eventos.routes'));
    };
    listen(){
        this.app.listen(this.port, () => {
            console.log('Escuchando en el puerto: ', this.port);
        });
    };
};


module.exports = Server;