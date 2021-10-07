const mongoose = require('../../database');
const bcrypy = require('bcrypt');

const TarefaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    lista: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lista',
        required: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    concluida: {
        type: Boolean,
        required: true,
        default: false,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

const Tarefa = mongoose.model('Tarefa', TarefaSchema);

module.exports = Tarefa;