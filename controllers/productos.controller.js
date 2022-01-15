const { Producto, Categoria } = require("../models");

//Obtener categorias - paginado - total - populate
const obtenerListadoProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('user', 'name')
            .populate('categoria', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);



    res.json({
        total,
        productos
    })


}
//Obtener categoria - populate {}
const obtenerProductoById = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
            .populate('user', 'name')
            .populate('categoria', 'name');

    if (!producto || !producto.status) {
        return res.status(400).json({
            msg: `No existe un producto con el id: ${id}`
        })
    }

    res.json({
        producto
    })
}

const crearProducto = async (req, res = response) => {
    const { status, user, ...body } = req.body;
    const { name, precio, descripcion, disponible, categoria } = body;
    name.toUpperCase();


    try {

        const [ productoDB, categoriaDB ] = await Promise.all([
            Producto.findOne({ name }),
            Categoria.findOne({ name: categoria })
        ]);
        
 
        if (!categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoria} no existe`
            });
        }

        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${productoDB.name} ya existe!`
            });
        }

        //Generar la data a guardar
        const data = {
            name,
            disponible,
            categoria: categoriaDB._id,
            descripcion,
            precio,
            user: req.user._id
        }
       
        const producto = new Producto(data);
        //Guardar DB
        await producto.save();
        res.status(201).json({
            msg: producto
        })

    } catch (error) {
        res.status(401).json({
            msg: 'No se pudo procesar el producto'
        })
        console.log(error)

    }
}

// Actualizar categoria - name
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    
    
    try {
        const producto = await Producto.findById(id).populate('categoria', 'name')

         
        const { name = producto.name,
            precio = producto.precio,
            descripcion = producto.descripcion,
            disponible = producto.disponible,
            categoria = producto.categoria.name} = req.body;
        
        const [productoDB, categoriaDB] = await Promise.all([
            Producto.findOne({ name }),
            Categoria.findOne({ name: categoria })
            ]);
            
        
        if ( !producto ) {
            return res.status(400).json({
                msg: `El producto con el id ${id} no existe`
            });
        }
        
        if (!categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoria} no existe`
            });
        }
        
        if (productoDB && productoDB.id !== producto.id) {
            return res.status(400).json({
                msg: `El producto ${productoDB.name} ya existe!`
            });
        }
        
        //Generar la data a guardar
        const data = {
            name,
            disponible,
            categoria: categoriaDB._id,
            descripcion,
            precio,
            user: req.user._id
        }
       
        //Actualizar en DB
        const productoFinish = await Producto.findByIdAndUpdate(id, data, {new: true})
        res.status(201).json({
            msg: productoFinish
        })

    } catch (error) {
        res.status(401).json({
            msg: 'No se pudo procesar el producto'
        })
        console.log(error)

    }
}

//Borrar categoria - estado: false
const eliminarProducto = async (req, res = response) => {
    const id = req.params.id;
    const producto = await Producto.findByIdAndUpdate(id, { status: false }, {new: true})

    res.status(200).json({
        msg: 'Producto eliminado exitosamente',
        producto
    })
}

module.exports = {
    crearProducto,
    obtenerListadoProductos,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto
}