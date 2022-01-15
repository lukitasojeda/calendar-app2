const { Evento } = require("../models");


const existeEvento = async (id = '') => {
    const existeEvento = await Evento.findById( id );
    if ( !existeEvento ) {
        throw new Error(`El evento con el id: '${id}' no existe.`);
    };
};

module.exports = {
    existeEvento
}