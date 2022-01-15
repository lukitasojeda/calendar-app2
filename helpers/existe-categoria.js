const { Categoria } = require("../models");


const existeCategoria = async (id = '') => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`La categoria con el id: '${id}' no existe.`);
    };
};

module.exports = {
    existeCategoria
}