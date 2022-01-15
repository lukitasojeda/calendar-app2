const { response } = require('express');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const loginController = async (req, res = response) => {
    const { correo, password } = req.body;


    try {
        //Pasos para un login exitoso:
        //Verificar si el email existe
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Verificar si el usuario está activo en la base de datos
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario no encontrado - Status: false'
            })
        }



        //Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta - Password'
            })
        }


        //Generar el JWT
        const { id } = user;
        const token = await generarJWT(id)







        res.json({
            user,
            token
        })

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador.'
        })

    }
}


const googleSignInController = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, img, correo } = await googleVerify(id_token)

        let user = await User.findOne({ correo });

        if (!user) {
            //Tengo que crearlo
            const data = {
                name,
                correo,
                password: ':P',
                img,
                role: 'USER_ROLE',
                google: true
            };
            user = new User(data);
            await user.save();
        }

        //Si el usuario en DB esta false
        if (!user.status) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(user.id)


        res.json({
            user,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}








module.exports = {
    loginController,
    googleSignInController
}