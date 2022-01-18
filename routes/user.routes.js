const { Router } = require('express');

const { check } = require('express-validator');

const {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete } = require('../controllers/users.controller');

const {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    tieneRole,
    esAdminRole
} = require('../middlewares');



const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('password', 'La contraseña debe tener minimo 6 caracteres.').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    check('role', 'No es un rol valido.').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos
], usersPost);

router.put('/:id', [
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(esRoleValido),
    validarCampos
], usersPut);

router.patch('/', usersPatch);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usersDelete);


module.exports = router;