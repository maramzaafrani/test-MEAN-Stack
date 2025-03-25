const User = require("../models/User");


exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["Admin", "Éditeur", "Rédacteur", "Lecteur"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Rôle mis à jour avec succès", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
