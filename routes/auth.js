const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({
            username,
            password: hashedPassword
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(201).send({ status: true, token });
    } catch (error) {
        res.status(400).send({ status: false, message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        console.log("user")
        console.log(user)
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ status: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.send({ status: true, token });
    } catch (error) {
        res.status(400).send({ status: false, message: 'Error logging in', error });
    }
});

router.post('/logout', (req, res) => {
    // Logika pembersihan jika diperlukan (misalnya, menghapus session)
    
    res.send({ status: true, message: 'Logout successful' });
});


module.exports = router;
