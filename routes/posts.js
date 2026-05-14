const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Нет токена!' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Неверный токен!' });
  }
};

// Получить все посты
router.get('/', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username, users.avatar
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC
  `).all();
  res.json(posts);
});

// Получить один пост
router.get('/:id', (req, res) => {
  const post = db.prepare(`
    SELECT posts.*, users.username, users.avatar
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = ?
  `).get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Пост не найден!' });
  res.json(post);
});

// Создать пост
router.post('/', auth, (req, res) => {
  const { title, content, cover_image } = req.body;
  const stmt = db.prepare('INSERT INTO posts (title, content, cover_image, author_id) VALUES (?, ?, ?, ?)');
  const result = stmt.run(title, content, cover_image, req.user.id);
  res.json({ message: 'Пост создан!', id: result.lastInsertRowid });
});

// Удалить пост
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ? AND author_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Пост удалён!' });
});

module.exports = router;