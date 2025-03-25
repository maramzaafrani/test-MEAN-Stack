const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  imageUrl: { type: String },
  tags: [{ type: String }],
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateCreation: { type: Date, default: Date.now }
});


articleSchema.index({ tags: 1 });
articleSchema.index({ auteur: 1 });

module.exports = mongoose.model('Article', articleSchema);
