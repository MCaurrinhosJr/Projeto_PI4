const mongoose = require('../../database');
const bcrypy = require('bcrypt');

const ListaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    tarefas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarefa',
    }],
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const Lista = mongoose.model('Lista', ListaSchema);

module.exports = Lista;