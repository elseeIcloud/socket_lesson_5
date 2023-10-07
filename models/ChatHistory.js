const Sequelize = require('sequelize');
const sequelize = require('../sequelize'); // Импортируйте настроенный объект Sequelize

const ChatHistory = sequelize.define('chat_history', {
    sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});

module.exports = ChatHistory;
