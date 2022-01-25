const { Router } = require('express');

const { check } = require('express-validator');
const { crearEvento, 
        obtenerListadoEventos, 
        obtenerEventoById,
        actualizarEvento,
        eliminarEvento} = require('../controllers/eventos.controller');

const { existeEvento } = require('../helpers/existe-evento');

const { isDate } = require('../helpers/isDate');

const { validarJWT, 
        esAdminRole} = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos.mw');


const router = Router();

// Todas tienen que pasar por la validacion del jwt
router.use( validarJWT );

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
    esAdminRole,
    check('title', 'title es obligatorio.').not().isEmpty(),
    check('start', 'start es obligatorio.').custom( isDate ),
    check('end', 'end es obligatoria.').custom( isDate ),
    check('user', 'El id del usuario es obligatorio / No es un id de mongo valido.').not().isEmpty(),
    validarCampos 
], crearEvento);

//Actualizar una categoria - privado - cualqueira con token valido
router.put('/:id',[
    esAdminRole,
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom( existeEvento ),
    validarCampos
],actualizarEvento)

//Borrar una categoria (Poner banderin) - privado - administrador
router.delete('/:id',[
    esAdminRole,
    check('id', 'No es un id de mongo valido.').isMongoId(),
    check('id').custom( existeEvento ),
    validarCampos
],eliminarEvento)




module.exports = router;