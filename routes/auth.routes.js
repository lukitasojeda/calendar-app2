const { Router } = require('express');

const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos.mw');

const { loginController,
        googleSignInController } = require('../controllers/auth.controller');


const router = Router();

router.post('/login', [
    check('correo', 'El es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
], loginController );

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignInController );



module.exports = router;