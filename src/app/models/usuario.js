const mongoose = require('../../database');
const bcrypy = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    },
});

UsuarioSchema.pre('save', async function(next){
    const hash = await bcrypy.hash(this.senha, 10);
    this.senha = hash;
    
    next();
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;