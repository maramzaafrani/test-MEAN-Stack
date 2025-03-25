const express = require('express');
const router = express.Router();
const { createComment, getCommentsByArticle } = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, createComment);
router.get('/:articleId', getCommentsByArticle);

module.exports = router;
