const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


exports.register = async (req, res) => {
  try {
    console.log("Données reçues:", req.body);  

    const { nom, email, motdepasse } = req.body;

    if (!nom || !email || !motdepasse) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    const newUser = new User({ nom, email, motdepasse: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(motdepasse, user.motdepasse))) {
      return res.status(400).json({ message: "Identifiants incorrects" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      refreshTokenSecret,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token requis" });

  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Utilisateur non autorisé" });

    jwt.verify(token, refreshTokenSecret, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token invalide" });

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        accessTokenSecret,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(204);

    user.refreshToken = null;
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  const bcrypt = require("bcryptjs");


const hashedPassword = await bcrypt.hash(motdepasse, 10);
const newUser = new User({ nom, email, motdepasse: hashedPassword });
await newUser.save();
if (!user || !(await bcrypt.compare(motdepasse, user.motdepasse))) {
  return res.status(400).json({ message: "Identifiants incorrects" });
}

};
