const { Schema,
    model } = require('mongoose');


const eventoSchema = Schema({
    title: {
        type: String,
        required: [true, 'El titulo es obligatorio.']
    },
    nota: { 
        type: String,
        required: [true, 'La nota es obligatoria'] 
    },
    startDate: { 
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'] 
    },
    endDate: { 
        type: Date,
        required: [true, 'La fecha de finalizacion es obligatoria'] 
    },
    status: {
        type: Boolean,
        default: true,
    }, 
    img: { 
        type: String 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El id de mongo del usuario que crea el evento es obligatorio'] 
    },
});

eventoSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Evento', eventoSchema);