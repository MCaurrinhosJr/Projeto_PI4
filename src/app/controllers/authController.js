const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const Usuario = require('../models/usuario');

const router = express.Router();

function gerarToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400, //token expira em um dia
    });
}

router.post('/registrar', async (req, res) => {
    const{ email } = req.body;

    try{
        if(await Usuario.findOne({ email }))
            return res.status(400).send({ error: 'Usuario já existe' });

        const user = await Usuario.create(req.body);

        user.senha = undefined;

        return res.send({ 
            user,
            token: gerarToken({ id: user.id })
         });
    } catch (err){
        return res.status(400).send({ error: 'Falha ao registrar Usuario'})
    }
});

router.post('/token', async (req, res) => {
    const { email, senha } = req.body;

    const user = await Usuario.findOne({ email }).select('+senha');

    if(!user)
        return res.status(400).send({ error: 'Usuario não encontrado' });
    if(!await bcrypt.compare(senha, user.senha))
        return res.status(400).send({ error: 'Senha invalida' });
    
    user.senha = undefined;

    res.send({ 
        user,
        token: gerarToken({ id: user.id })
     });
})
module.exports = app => app.use('/auth', router);