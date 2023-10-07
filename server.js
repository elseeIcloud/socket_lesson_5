const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./sequelize'); // Импортируйте настроенный объект Sequelize
const User = require('./models/User'); // Импортируйте модель пользователя
const ChatHistory = require('./models/ChatHistory'); // Импортируйте модель истории переписки
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({ origin: 'http://localhost:8081' }));

const server = http.createServer(app); // Создайте HTTP-сервер

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8081",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Подключение к базе данных
sequelize
    .authenticate()
    .then(() => {
        console.log('Подключено к базе данных MySQL');
    })
    .catch((err) => {
        console.error('Ошибка подключения к базе данных:', err);
    });

// Роуты для регистрации и авторизации
app.use('/auth', require('./routes/auth'));

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.join('default-room');

    socket.on('chat message', (data) => {
        // Сохранение сообщения в базе данных
        ChatHistory.create({
            sender_id: data.senderId,
            receiver_id: data.receiverId,
            message: data.message,
        })
            .then(() => {
                // Отправка сообщения в текущую комнату
                io.to(data.room).emit('chat message', data);
            })
            .catch((error) => {
                console.error('Ошибка при сохранении сообщения:', error);
            });
    });

    socket.on('join room', (room) => {
        socket.leaveAll();
        socket.join(room);
        updateUserCount(room);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });

    // Обновление количества пользователей в комнате
    const updateUserCount = (room) => {
        const roomSocket = io.sockets.adapter.rooms.get(room);
        const userCount = roomSocket ? roomSocket.size : 0;
        io.to(room).emit('user count', userCount);
    };
});

const PORT = 3000;
server.listen(PORT, () => { // Используйте переменную server
    console.log(`Сервер запущен на порту ${PORT}`);
});
