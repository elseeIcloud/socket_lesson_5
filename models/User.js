const Sequelize = require('sequelize');
const sequelize = require('../sequelize'); // Импортируйте настроенный объект Sequelize

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = User;
