const express = require('express');
const connection = require('./database/connection'); //importando as conexões do banco de dados

const routes = express.Router();

//iniciar contagem do tempo (T01)
routes.post('/manage_tasks/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao

    let horario_start = new Date(); //date que vai receber o TIME inicial que vem do banco
    let horario_pause = new Date(); //date que vai receber o TIME atual que o usuário pausou a tarefa
    
    const horario_string_incio = await connection('task').select('tempo_inicio').where('id', id).first(); //STRING com horário inicial
    const horario_string_pause = horario_pause.getHours().toString() + ':' + horario_pause.getMinutes().toString() + ':' + horario_pause.getSeconds().toString(); //STRING com horário pausado

    await connection('task').update('tempo_pause', horario_string_pause).where('id', id); //jogando o horario de pause no banco

    const value_start = horario_string_incio.tempo_inicio.split(':'); // SPLITANDO horario_string_inicio em um vetor com 3 posições [HH, MM, SS]
    const value_pause = horario_string_pause.split(':'); // SPLITANDO horario_string_pause em um vetor com 3 posições [HH, MM, SS]

    horario_start.setHours(value_start[0], value_start[1], value_start[2], 0); // transformando minha string em date para fazer a conta 
    horario_pause.setHours(value_pause[0], value_pause[1], value_pause[2], 0); // transformando minha string em date para fazer a conta

    // const millisecond = horario_pause - horario_start;
    const tempo_executado_em_minutos = (horario_pause - horario_start) / 60000;
    const tempo_executado_em_horas = tempo_executado_em_minutos / 60;

    await connection('task').update('tempo_executado', tempo_executado_em_minutos).where('id', id); //atualizando o valor do tempo executado no banco

    //console.log(tempo_executado_em_minutos + "min");
    //console.log(tempo_executado_em_horas + "h");

    return response.json({id, horario_start, horario_pause, tempo_executado_em_minutos, tempo_executado_em_horas});
});

//pausar contagem do tempo (T01)
routes.post('/manage_tasks/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao

    let horario_start = new Date(); //date que vai receber o TIME inicial que vem do banco
    let horario_pause = new Date(); //date que vai receber o TIME atual que o usuário pausou a tarefa
    
    const horario_string_incio = await connection('task').select('tempo_inicio').where('id', id).first(); //STRING com horário inicial
    const horario_string_pause = horario_pause.getHours().toString() + ':' + horario_pause.getMinutes().toString() + ':' + horario_pause.getSeconds().toString(); //STRING com horário pausado

    await connection('task').update('tempo_pause', horario_string_pause).where('id', id); //jogando o horario de pause no banco

    const value_start = horario_string_incio.tempo_inicio.split(':'); // SPLITANDO horario_string_inicio em um vetor com 3 posições [HH, MM, SS]
    const value_pause = horario_string_pause.split(':'); // SPLITANDO horario_string_pause em um vetor com 3 posições [HH, MM, SS]

    horario_start.setHours(value_start[0], value_start[1], value_start[2], 0); // transformando minha string em date para fazer a conta 
    horario_pause.setHours(value_pause[0], value_pause[1], value_pause[2], 0); // transformando minha string em date para fazer a conta

    // const millisecond = horario_pause - horario_start;
    const tempo_executado_em_minutos = (horario_pause - horario_start) / 60000;
    const tempo_executado_em_horas = tempo_executado_em_minutos / 60;

    console.log(tempo_executado_em_minutos + "min");
    console.log(tempo_executado_em_horas + "h");

    return response.json({id, horario_start, horario_pause, tempo_executado_em_minutos, tempo_executado_em_horas});
});

//concluir contagem do tempo (T01)
routes.post('/manage_tasks/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao

    let horario_start = new Date(); //date que vai receber o TIME inicial que vem do banco
    let horario_finish = new Date(); //date que vai receber o TIME atual que o usuário pausou a tarefa
    
    const horario_string_incio = await connection('task').select('tempo_inicio').where('id', id).first(); //STRING com horário inicial
    console.log(horario_string_incio); //teste
    const tempo_executado = await connection('task').select('tempo_executado').where('id', id).first(); //STRING com tempo de horário executado
    if(tempo_executado == 0){
        const horario_string_finish = horario_finish.getHours().toString() + ':' + horario_finish.getMinutes().toString() + ':' + horario_finish.getSeconds().toString(); //STRING com horário pausado
        const value_start = horario_string_incio.tempo_inicio.split(':'); // SPLITANDO horario_string_inicio em um vetor com 3 posições [HH, MM, SS]
        const value_finish = horario_string_finish.split(':'); // SPLITANDO horario_string_pause em um vetor com 3 posições [HH, MM, SS]
    
        console.log(horario_string_finish); //teste

        horario_start.setHours(value_start[0], value_start[1], value_start[2], 0); // transformando minha string em date para fazer a conta 
        horario_finish.setHours(value_finish[0], value_finish[1], value_finish[2], 0); // transformando minha string em date para fazer a conta
    
        // const millisecond = horario_finish - horario_start;
        const tempo_executado_em_minutos = (horario_finish - horario_start) / 60000;
        const tempo_executado_em_horas = tempo_executado_em_minutos / 60;
    
        console.log(tempo_executado_em_minutos + "min");
        console.log(tempo_executado_em_horas + "h");
    
        return response.json({id, horario_start, horario_finish, tempo_executado_em_minutos, tempo_executado_em_horas});
    }

    //await connection('task').update('tempo_pause', horario_string_pause).where('id', id); //jogando o horario de pause no banco

});

//listagem para o dropdown (T01)
routes.get('/manage_tasks', async (request, response) => {
    const task = await connection('task').select('name');
    return response.json(task);
});

//cadastro da task (T02)
routes.post('/register_tasks', async (request, response) => {
    const { name, description } = request.body; //pega os dados da requisição
    await connection('task').insert({
        name,
        description,
    })
    return response.json();
});

//listagem das tasks por nome, descrição e tempo (T03)
routes.get('/list_tasks', async (request, response) => {
    const task = await connection('task').select('id', 'name', 'description', 'tempo_executado', 'tempo_inicio');
    return response.json(task);
});

//exclusão de uma tarefa (T03)
routes.delete('/list_tasks/:id', async (request, response) => {
    const {id} = request.params; //pegar o id da ong que sera deletada
    
    const incident = await connection('task')
    .where('id', id);
    await connection('task').where('id', id).delete(); //deleta o registro de dentro da tabela do bd

    return response.status(204).send(); //stts com retorno de resposta sem conteudo mas com sucesso 
});

module.exports = routes;