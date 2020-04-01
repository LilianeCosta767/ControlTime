//impotações do pacote knex e das configurações do banco
const knex = require('knex');
const configuration = require('../../knexfile')

//criando a conexão
const connection = knex(configuration.development); //conexão de DESENVOLVIMENTO

module.exports = connection; //exportação