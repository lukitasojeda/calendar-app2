const { request, response } = require("express");



const esAdminRole = ( req = request, res = response, next ) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'Se quiere validar el role sin verificar el token primero'
        });
    };
    const {role, name} = req.user;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `El usuario '${name}', no es administrador - rol no autorizado`
        });
    };

    next();
};

const tieneRole = ( ...roles ) => {
    return ( req = request, res = response, next ) => {

        if( !roles.includes( req.user.role )){
            return res.status(401).json({
                msg: `El servicio requiere un rol en especifico - ${roles}`
            })
        }
        
        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
};