const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sedairia', 'psql', 'psql', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});


sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
