const Article = require('../models/Article');


exports.createArticle = async (req, res) => {
  try {
    const { titre, contenu, imageUrl, tags } = req.body;
    const newArticle = new Article({
      titre,
      contenu,
      imageUrl,
      tags,
      auteur: req.user.id
    });
    await newArticle.save();
    res.status(201).json({ message: 'Article créé avec succès', article: newArticle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ dateCreation: -1 })
      .populate('auteur', 'nom email role');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('auteur', 'nom email role');
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateArticle = async (req, res) => {
  try {
    const { titre, contenu, imageUrl, tags } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: 'Article non trouvé' });

    if (req.user.role === 'Admin' || req.user.role === 'Éditeur' || (req.user.role === 'Rédacteur' && article.auteur.toString() === req.user.id)) {
      if (titre !== undefined) article.titre = titre;
      if (contenu !== undefined) article.contenu = contenu;
      if (imageUrl !== undefined) article.imageUrl = imageUrl;
      if (tags !== undefined) article.tags = tags;

      await article.save();
      res.json({ message: 'Article mis à jour avec succès', article });
    } else {
      return res.status(403).json({ message: 'Accès refusé' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteArticle = async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ message: 'Article non trouvé' });
  
      
      if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      
      await Article.deleteOne({ _id: req.params.id });
  
      res.json({ message: 'Article supprimé avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
