const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', verifyToken, articleController.updateArticle);
router.delete('/:id', verifyToken, articleController.deleteArticle);

module.exports = router;
