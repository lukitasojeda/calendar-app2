const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }


    try {

        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); 
        
        req.id = id;

        user = await User.findById( id );

        req.user = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            msg: 'token no valido'
        })
    }
    
};















module.exports = {
    validarJWT
};