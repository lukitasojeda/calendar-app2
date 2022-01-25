const { Schema,
    model } = require('mongoose');


const eventoSchema = Schema({
    title: {
        type: String,
        required: [true, 'El titulo es obligatorio.']
    },
    notes: { 
        type: String
    },
    start: { 
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria'] 
    },
    end: { 
        type: Date,
        required: [true, 'La fecha de finalizacion es obligatoria'] 
    },
    status: {
        type: Boolean,
        default: true,
    }, 
    user: {
        type: Object,
        required: [true, 'El user que crea el evento es obligatorio'],
        uid: {
            type: Schema.Types.ObjectId,
            required: [true, 'El id de mongo del usuario que crea el evento es obligatorio'] 
        },
        name: {
            type: String,
            required: [true, 'El name del usuario que crea el evento es obligatorio'] 
        },
        
    },
});

eventoSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Evento', eventoSchema);