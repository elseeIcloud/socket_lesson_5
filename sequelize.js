const Sequelize = require('sequelize');

const sequelize = new Sequelize('socket', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false, // Опция для отключения автоматического добавления временных меток к таблицам
    },
});

module.exports = sequelize;
