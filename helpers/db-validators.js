const Role = require('../models/role');
const user = require('../models/user');


const esRoleValido = async (role = '') => {
    const existeRole = await Role.findOne({ role });
    if (!existeRole) {
        throw new Error(`El rol ${role}, no está registrado en la base de datos.`);
    }
};

const existeEmail = async (correo = '') => {
    const conflictoCorreo = await user.findOne({ correo });
    if (conflictoCorreo) {
        throw new Error(`El correo '${correo}' ya está registrado.`);
    };
};

const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await user.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id '${id}' no existe.`);
    };
};




module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}