const express = require('express');
const jwt = require('jsonwebtoken');
const Password = require('../models/Password');
const User = require('../models/User');

const router = express.Router();

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).send({ status: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {        
    return res.status(401).send({ status: false, message: 'Unauthorized' });
  }
};

// List passwords
router.get('/', verifyToken, async (req, res) => {  
  try {
    const passwords = await Password.findAll({
      where: { userId: req.userId },
      attributes: ['id', 'site', 'username']
    });
    res.send(passwords);
  } catch (error) {
    res.status(400).send({ message: 'Error fetching passwords', error,status:false });
  }
});

// Detail password by ID
router.post('/detail', verifyToken, async (req, res) => {
  try {
    const { passwordId } = req.body;
    const password = await Password.findByPk(passwordId);
    if (password.userid !== req.userId) {
      return res.status(403).send({ message: 'You are not the owner of this password' ,status:false });
    }
    res.send(password);
  } catch (error) {
    res.status(400).send({ message: 'Error fetching password detail', error,status:false });
  }
});

// Edit password
router.put('/edit', verifyToken, async (req, res) => {
  try {
      const { passwordId, newSite, newPassword, newUsername, newDescription } = req.body;
      const password = await Password.findByPk(passwordId);

      // Validasi: Pastikan pengguna yang login adalah pemilik password
      if (password.userid !== req.userId) {
          return res.status(403).send({ status: false, message: 'You are not the owner of this password' });
      }

      // Perbarui properti password
      password.site = newSite;
      password.password = newPassword;
      password.username = newUsername;
      password.description = newDescription;
      await password.save();

      res.send({ status: true, message: 'Password updated successfully' });
  } catch (error) {
      res.status(400).send({ status: false, message: 'Error updating password', error });
  }
});


router.post('/add', verifyToken, async (req, res) => {
  const { site, password, passwordConfirm, username, usernameConfirm, description } = req.body;

  // Validasi input
  if (!site || !password || !passwordConfirm || !username || !usernameConfirm) {        
    return res.status(400).send({ status: false, message: 'All fields are required' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).send({ status: false, message: 'Passwords do not match' });
  }
  if (username !== usernameConfirm) {
    return res.status(400).send({ status: false, message: 'Usernames do not match' });
  }

  try {
      const newPassword = await Password.create({
          userid: req.userId,
          site,
          password,
          username,
          description
      });
      res.status(201).send({ status: true, message: 'Password added successfully', data: newPassword });
  } catch (error) {
      res.status(400).send({ status: false, message: 'Error adding password', error });
  }
});
router.delete('/delete', verifyToken, async (req, res) => {
  const { passwordId } = req.body;

  try {
      const password = await Password.findByPk(passwordId);
      if (!password) {
          return res.status(404).send({ status: false, message: 'Password not found' });
      }

      // Validasi: Pastikan pengguna yang login adalah pemilik password
      if (password.userid !== req.userId) {
          return res.status(403).send({ status: false, message: 'You are not authorized to delete this password' });
      }

      await password.destroy();
      res.send({ status: true, message: 'Password deleted successfully' });
  } catch (error) {
      res.status(400).send({ status: false, message: 'Error deleting password', error });
  }
});



module.exports = router;
