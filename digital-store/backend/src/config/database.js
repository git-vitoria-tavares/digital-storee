// Configuração do banco usada pelo Sequelize e pelo sequelize-cli (migrations e seeds)
require('dotenv').config({ quiet: true });

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false,
  define: { underscored: true }, // colunas created_at / updated_at
};

module.exports = {
  development: config,
  // Os testes (npm test) usam outro banco para não apagar seus dados
  test: { ...config, database: process.env.DB_NAME_TEST },
};
