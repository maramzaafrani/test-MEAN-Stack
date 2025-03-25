const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  contenu: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
