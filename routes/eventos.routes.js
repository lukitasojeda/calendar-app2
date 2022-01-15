const { Router } = require('express');

const { check } = require('express-validator');
const { crearEvento, 
        obtenerListadoEventos, 
        obtenerEventoById,
        actualizarEvento,
        eliminarEvento} = require('../controllers/eventos.controller');
const { existeEvento } = require('../helpers/existe-evento');

// const { validarJWT, 
//         esAdminRole} = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos.mw');


const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerListadoEventos)

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom( existeEvento ),
    validarCampos
],obtenerEventoById)

//Crear una nueva categoria - privado - cualquier persona con un token valido (cualquier rol)
router.post('/', [
//     validarJWT,
    check('title', 'title es obligatorio.').not().isEmpty(),
    check('startDate', 'startDate es obligatorio.').not().isEmpty(),
    check('endDate', 'endDate es obligatoria.').not().isEmpty(),
    check('user', 'El id del usuario es obligatorio / No es un id de mongo valido.').isMongoId(),
    validarCampos 
], crearEvento);

//Actualizar una categoria - privado - cualqueira con token valido
router.put('/:id',[
    // validarJWT,
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom( existeEvento ),
    validarCampos
],actualizarEvento)

//Borrar una categoria (Poner banderin) - privado - administrador
router.delete('/:id',[
    // validarJWT,
    // esAdminRole,
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom( existeEvento ),
    validarCampos
],eliminarEvento)




module.exports = router;