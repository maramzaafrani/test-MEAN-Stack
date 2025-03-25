
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const User = require('../models/User');


exports.createComment = async (req, res) => {
  try {
    const { contenu, articleId, parentId } = req.body;

    const comment = new Comment({
      contenu,
      article: articleId,
      auteur: req.user.id,
      parent: parentId || null
    });

    await comment.save();

    
    const article = await Article.findById(articleId).populate('auteur');
    const io = req.app.get('io');

   
    if (article && article.auteur && article.auteur._id.toString() !== req.user.id) {
      io.emit(`notification-${article.auteur._id}`, {
        message: `Nouveau commentaire sur votre article "${article.titre}"`
      });
    }

    
    io.emit('new-comment', {
      ...comment.toObject(),
      auteur: { _id: req.user.id, nom: req.user.nom },
      article: articleId
    });

    res.status(201).json({ message: 'Commentaire ajouté', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('auteur', 'nom')
      .lean();


    const map = {};
    const roots = [];

    comments.forEach(comment => {
      comment.children = [];
      map[comment._id] = comment;
    });

    comments.forEach(comment => {
      if (comment.parent) {
        map[comment.parent]?.children.push(comment);
      } else {
        roots.push(comment);
      }
    });

    res.json(roots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
