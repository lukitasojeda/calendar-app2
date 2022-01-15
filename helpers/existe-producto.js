const { Producto } = require("../models");


const existeProducto = async (id = '') => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error(`El producto con el id: '${id}' no existe.`);
    };
};

module.exports = {
    existeProducto
}