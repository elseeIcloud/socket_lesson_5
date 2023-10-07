const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Роут для регистрации пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword });

        res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }
});

// Роут для авторизации пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            res.status(401).json({ error: 'Пользователь не найден' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Неверный пароль' });
            return;
        }

        res.status(200).json({ message: 'Авторизация успешна' });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ error: 'Ошибка при авторизации' });
    }
});

module.exports = router;
