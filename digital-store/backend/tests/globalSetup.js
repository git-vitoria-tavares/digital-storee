// Cria o banco de testes (DB_NAME_TEST) caso ainda não exista.
const mysql = require('mysql2/promise');
const config = require('../src/config/database').test;

module.exports = async () => {
  const conn = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
  await conn.end();
};
