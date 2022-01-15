

const coleccionesPermitidas = ( coleccion = '', coleccionesP = [] ) => {
    const incluida = coleccionesP.includes( coleccion );
    if( !incluida ){
        throw new Error(`La coleccion '${coleccion}' no es permitida - use '${coleccionesP}'`);
    };
    return true;
};



module.exports = {
    coleccionesPermitidas
};