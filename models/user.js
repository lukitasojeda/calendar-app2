const { Schema,
        model } = require('mongoose');

//Modelo de usuario (Schema = Esquema).
const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio.']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
}

//Forma de exportar el Schema como modelo para ser utilizado.
module.exports = model( 'User', userSchema );