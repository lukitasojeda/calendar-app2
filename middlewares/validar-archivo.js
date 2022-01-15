

const validarArchivo = ( req = request, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No hay archivos en el request.'
        });
        return; 
    }

    next();
};

module.exports = {
    validarArchivo
}