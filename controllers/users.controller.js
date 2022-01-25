const { response,
        request } = require('express');

const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const User = require('../models/user');


const usersGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ total, usuarios ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
};

const usersPost = async (req, res = response) => {
    //Almacenamiento de errores.


    const { name, password, correo, role } = req.body;
    const user = new User({ name, password, correo, role });

    //Verificar si el correo existe


    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Generar el JWT
    const { id } = user;
    const token = await generarJWT(id)

    //Guardar en la base de datos
    await user.save();

    res.json({
        user,
        token
    })
};

const usersPut = async (req, res = response) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;
    //TODO validar contra base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, resto);
    res.json(user);
};

const usersPatch = (req, res = response) => {
    res.json({
        value: 'Patch api - Controller'
    })
};

const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    const uid = req.id;

    //Fisicamente lo borramos.
    // const user = await User.findByIdAndDelete( id );

    //Cambiar su estado a "false", es decir poniendole un banderin.
    const user = await User.findByIdAndUpdate( id, { status: false } );

    const userAuth = req.user;

    if( !user ){
        return res.status(401).json({
            msg: 'Token no valido - Usuario no existe en DB'
        })
    }

    //Verificar si el usuario tiene el estado en true
    if( !userAuth.status ){
        return res.status(401).json({
            msg: 'Token no valido - status: false'
        })
    }

    
    res.json({
        user,
        userAuth
    })
};


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}
