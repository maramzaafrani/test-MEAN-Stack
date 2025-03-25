const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Éditeur", "Rédacteur", "Lecteur"],
    default: "Lecteur",
  },
  refreshToken: { type: String }
});

module.exports = mongoose.model("User", userSchema);
