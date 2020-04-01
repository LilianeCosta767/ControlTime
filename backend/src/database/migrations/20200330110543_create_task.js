
exports.up = function(knex) {
    //criando a tabela de criação de tarefa.
    return knex.schema.createTable('task', function(table) {
        table.increments(); //para criar uma chave primaria autoincrement
        table.string('name').notNullable();
        table.string('description');
        table.time('tempo_inicio');
        table.time('tempo_pause');
        table.decimal('tempo_executado');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('task');
};
