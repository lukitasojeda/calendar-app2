const { Evento } = require("../models");
const user = require("../models/user");

const obtenerListadoEventos = async (req, res = response) => {
    // const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, eventos] = await Promise.all([
        Evento.countDocuments(query)
            .populate('user', 'name'),
        Evento.find(query)
            // .skip(Number(desde))
            // .limit(Number(limite))
    ]);



    res.json({
        total,
        eventos
    })


}

const crearEvento = async(req, res = response) => {
    const { body } = req;
    const { title, nota, start, end, user} = body;


    try {

        //Generar la data a guardar
        const data = {
            title,
            nota,
            start,
            end,
            user
        }
       
        const evento = new Evento(data);
        //Guardar DB
        await evento.save();
        res.status(201).json({
            msg: evento
        })

    } catch (error) {
        res.status(401).json({
            msg: 'No se pudo procesar el elvento'
        })
        console.log(error)

    }
}

const obtenerEventoById = async (req, res = response) => {
    const { id } = req.params;

    const evento = await Evento.findById(id);

    if (!evento || !evento.status) {
        return res.status(400).json({
            msg: `No existe un evento con el id: ${id}`
        })
    }

    res.json({
        evento
    })
}

const actualizarEvento = async (req, res = response) => {
    const { id } = req.params;

    const uuid = req.body.uid;
    
    try {
        const evento = await Evento.findById(id)

        if ( !evento ) {
            return res.status(400).json({
                msg: `El evento con el id ${id} no existe`
            });
        }

        if ( evento.user.uid.toString() !== uuid ) {
            return res.status(401).json({
                msg: `Este usuario no está autorizado`
            });
        }
         
        
        //Generar la data a guardar
        const newData = {
            ...req.body.event
        }

       
        //Actualizar en DB
        const eventoFinish = await Evento.findByIdAndUpdate(id, newData, {new: true})
        res.status(201).json({
            msg: eventoFinish
        })

    } catch (error) {
        res.status(401).json({
            msg: 'No se pudo procesar el evento'
        })
        console.log(error)

    }
}

const eliminarEvento = async (req, res = response) => {
    const { id } = req.params;

    const uuid = req.body.uid;
    
    try {
        const evento = await Evento.findById(id)

        if ( !evento ) {
            return res.status(400).json({
                msg: `El evento con el id ${id} no existe`
            });
        }

        if ( evento.user.uid.toString() !== uuid ) {
            return res.status(401).json({
                msg: `Este usuario no está autorizado`
            });
        }
         

    const eventoDB = await Evento.findByIdAndUpdate(id, { status: false }, {new: true})

    res.status(200).json({
        msg: 'Todo ok',
        eventoDB
    })

    } catch (error) {
        res.status(401).json({
            msg: 'No se pudo procesar el evento'
        })
        console.log(error)

    }
}

module.exports = {
    crearEvento,
    obtenerListadoEventos,
    obtenerEventoById,
    actualizarEvento,
    eliminarEvento
}