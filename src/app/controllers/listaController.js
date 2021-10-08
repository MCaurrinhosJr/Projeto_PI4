const express = require('express');
const middleware = require('../middlewares/auth');
const Lista = require('../models/lista');
const Tarefa = require('../models/tareafa');

const router = express.Router();

router.use(middleware);

router.get('/', async (req, res) =>{
    try {
        const listas = await Lista.find().populate([ 'usuario', 'tarefas']);

        return res.send({ listas });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao carregar listas'});
    }
});

router.get('/:listaId', async (req, res) =>{
    try {
        const listas = await Lista.findById(req.params.listaId).populate([ 'usuario', 'tarefas']);

        return res.send({ listas });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao carregar lista'});
    }
});

router.post('/', async (req, res) =>{
    try {
        const { titulo, descricao, tarefas } = req.body;

        const lista = await Lista.create({
            titulo: titulo,
            descricao: descricao,
            usuario: req.userId
        });

        await Promise.all(tarefas.map( async tarefa => {
            const listaTarefa = new Tarefa({ ...tarefa, lista: lista._id });

            await listaTarefa.save();

            lista.tarefas.push(listaTarefa);
        }));

        await lista.save();

        return res.send({ lista });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Erro ao criar lista'});
    }
});

router.put('/:listaId', async (req, res) =>{
    try {
        const { titulo, descricao, tarefas } = req.body;
        const lista = await Lista.findByIdAndUpdate(req.params.listaId, {
            titulo,
            descricao
        }, { new: true });

        lista.tarefas = [];
        await Tarefa.remove({ lista: lista._id });

        await Promise.all(tarefas.map( async tarefa => {
            const listaTarefa = new Tarefa({ ...tarefa, lista: lista._id });

            listaTarefa.save();
            lista.tarefas.push(listaTarefa);
        }));

        await lista.save();

        return res.send({ lista });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao atualizar a lista'});
    }
});

router.delete('/:listaId', async (req, res) =>{
    try {
        await Lista.findByIdAndRemove(req.params.listaId);

        return res.send();

    } catch (error) {
        return res.status(400).send({ error: 'Erro ao remover lista'});
    }
});

module.exports = app => app.use('/listas', router);