

const dbValdators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const GoogleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const existeProducto = require('./existe-producto');
const existeCategoria = require('./existe-categoria');
const coleccionesPermitidas = require('./colecciones-permitidas');


module.exports = {
    ...dbValdators,
    ...generarJWT,
    ...GoogleVerify,
    ...subirArchivo,
    ...existeProducto,
    ...existeCategoria,
    ...coleccionesPermitidas,
}