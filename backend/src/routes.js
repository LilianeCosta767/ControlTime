const express = require('express');
const connection = require('./database/connection'); //importando as conexões do banco de dados

const routes = express.Router();


//iniciar contagem do tempo (T01)
routes.post('/manage_tasks/start/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao
    console.log("/manage_task/start/");
    const retorno_banco = await connection('task').select('tempo_inicio').where('id', id).first();
    let horario_string_inicio = retorno_banco.tempo_inicio;
    /* Se não tiver iniciado o contador dou start nele.. Mas se eu já tiver iniciado o contador, simplesmente retorno */
    if (horario_string_inicio == null || horario_string_inicio.localeCompare('00:00:00')==0) 
    {
        console.log("\tiniciando tarefa");
        let horario_start = new Date(); //date para recuperar o horário atual do computador
    
        /* STRING com horário inicial */
        horario_string_inicio = 
            horario_start.getHours().toString() + ':' + 
            horario_start.getMinutes().toString() + ':' + 
            horario_start.getSeconds().toString();
    
        /* Atualizar o valor da variavel tempo_inicio no banco de dados da tarefa :id */
        await connection('task').update('tempo_inicio', horario_string_inicio).where('id', id);
    }

    return response.json({id, horario_string_inicio});
});

//pausar contagem do tempo (T01)
routes.post('/manage_tasks/pause/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao
    let retorno_banco = await connection('task').select('tempo_inicio').where('id', id).first(); //query com horário inicial
    const horario_string_inicio = retorno_banco.tempo_inicio; // STRIN com horário inicial
    if ((horario_string_inicio) && (horario_string_inicio.localeCompare("00:00:00") != 0)) // significa que essa tarefa recebeu um "START"
    {
        console.log("/manage_task/pause/ tarefa foi iniciada");    
        let horario_start = new Date(); //date que vai receber o TIME inicial que vem do banco
        let horario_pause = new Date(); //date que vai receber o TIME atual que o usuário pausou a tarefa
        /* STRING com horário pausado */
        const horario_string_pause = 
            horario_pause.getHours().toString() + ':' + 
            horario_pause.getMinutes().toString() + ':' + 
            horario_pause.getSeconds().toString();         
        /* SPLITANDO horario_string_inicio e horario_string_pause em um vetor com 3 posições [HH, MM, SS] */
        const value_start = horario_string_inicio.split(':');
        const value_pause = horario_string_pause.split(':');
        /* jogando o horario de pause no banco */
        await connection('task').update('tempo_pause', horario_string_pause).where('id', id);
        /* transformando minha string em date para fazer a conta */
        horario_start.setHours(value_start[0], value_start[1], value_start[2], 0); 
        horario_pause.setHours(value_pause[0], value_pause[1], value_pause[2], 0); 
        const tempo_executado_em_minutos = (horario_pause - horario_start) / 60000
        (tempo_executado_em_minutos < 0) ? tempo_executado_em_minutos = (tempo_executado_em_minutos * (-1)) : tempo_executado_em_minutos = tempo_executado_em_minutos;
        /* atualizo o valor tempo_executado até o momento em que o usuário deu pause */
        await connection('task').update('tempo_executado', tempo_executado_em_minutos).where('id', id);
        
        return response.json({id, horario_string_inicio, horario_string_pause, tempo_executado_em_minutos/*, tempo_executado_em_horas*/});
    }
    else /* significa que a tarefa não foi iniciada ainda...*/
    {
        console.log("/manage_task/pause/ tarefa não foi iniciada");
        return response.status(202).json({id, tempo_executado:"-1"}); //202 significa que a requisição foi aceita, mas nenhuma funcionalidade foi executada.
    }
});

//concluir contagem do tempo (T01)
routes.post('/manage_tasks/finish/:id', async (request, response) => {
    const {id} = request.params; //id da task em questao
    let retorno_banco = await connection('task').select('tempo_inicio').where('id', id).first(); //query com horário inicial
    const horario_string_inicio = retorno_banco.tempo_inicio; // STRIN com horário inicial
    if ((horario_string_inicio) && (horario_string_inicio.localeCompare("00:00:00") != 0)) // significa que essa tarefa recebeu um "START"
    {
        console.log("/manage_task/finish/ tarefa foi iniciada");    
        let horario_start = new Date(); //date que vai receber o TIME inicial que vem do banco
        let horario_finish = new Date(); //date que vai receber o TIME atual que o usuário pausou a tarefa
        /* STRING com horário pausado */
        const horario_string_finish = 
            horario_finish.getHours().toString() + ':' + 
            horario_finish.getMinutes().toString() + ':' + 
            horario_finish.getSeconds().toString();         
        /* SPLITANDO horario_string_inicio e horario_string_finish em um vetor com 3 posições [HH, MM, SS] */
        const value_start = horario_string_inicio.split(':');
        const value_pause = horario_string_finish.split(':');
        /* jogando o horario de pause no banco */
        await connection('task').update('tempo_pause', horario_string_finish).where('id', id);
        /* transformando minha string em date para fazer a conta */
        horario_start.setHours(value_start[0], value_start[1], value_start[2], 0); 
        horario_finish.setHours(value_pause[0], value_pause[1], value_pause[2], 0); 
        const tempo_executado_em_minutos = (horario_finish - horario_start) / 60000;
        (tempo_executado_em_minutos < 0) ? tempo_executado_em_minutos = (tempo_executado_em_minutos * (-1)) : tempo_executado_em_minutos = tempo_executado_em_minutos;
        /* atualizo o valor tempo_executado até o momento em que o usuário deu pause */
        await connection('task').update({
                'tempo_executado': tempo_executado_em_minutos,
                'tempo_inicio': null,
                'tempo_pause': null
            }).where('id', id);
        
        return response.json({id, tempo_executado_em_minutos/*, tempo_executado_em_horas*/});
    }
    else /* significa que a tarefa não foi iniciada ainda...*/
    {
        console.log("/manage_task/finish/ tarefa não foi iniciada");
        return response.status(202).json({id, tempo_executado:"-1"}); //202 significa que a requisição foi aceita, mas nenhuma funcionalidade foi executada.
    }
});

//listagem para o dropdown (T01)
routes.get('/manage_tasks', async (request, response) => {
    const task = await connection('task').select('*');
    console.log(task)
    return response.json(task);
});

//cadastro da task (T02)
routes.post('/register_tasks', async (request, response) => {
    const { name, description } = request.body; //pega os dados da requisição
    await connection('task').insert({
        name,
        description,
    });
    return response.json({name});
});

//listagem das tasks por nome, descrição e tempo (T03)
routes.get('/list_tasks', async (request, response) => {
    const task = await connection('task').select('id', 'name', 'description', 'tempo_executado', 'tempo_inicio');
    return response.json(task);
});

//contagem tempo total
routes.get('/manage_tasks/time', async (request,response)=>{
    const retorno_banco = await connection('task').sum('tempo_executado').as('soma_total');
    
    const soma_total = retorno_banco[0]['sum(`tempo_executado`)'];
    return response.json({soma_total});
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