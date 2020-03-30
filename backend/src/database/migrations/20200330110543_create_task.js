
exports.up = function(knex) {
    //criando a tabela de criação de tarefa.
    return knex.schema.createTable('task', function(table) {
        table.string('id').primary();
        table.string('name').notNullable();
        table.string('description');
        table.numeric('tempo_executado');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('task');
};
