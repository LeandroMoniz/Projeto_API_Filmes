const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('dpproject', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

try {
    sequelize.authenticate()
    console.log('Conectamos com sucesso!')
} catch (err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize