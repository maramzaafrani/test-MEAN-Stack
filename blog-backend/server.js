const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
app.set("io", io);

// ===> MIDDLEWARES
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(helmet());
app.use(express.json());


const apiLimiter = rateLimit({
  windowMs: 150 * 600 * 10000, 
  max: 10,
  message: { message: "🚫 Trop de requêtes, réessayez plus tard." }
});
app.use("/auth", apiLimiter);
app.use("/articles", apiLimiter);
app.use("/comments", apiLimiter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next();
});


const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const articleRoutes = require("./routes/article.routes");
const commentRoutes = require("./routes/comment.routes");
const { verifyToken } = require("./middlewares/auth.middleware");

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);

//  ROUTE TEST PRIVÉE (avec token)
app.get("/private", verifyToken, (req, res) => {
  res.json({ message: "Route privée accessible", user: req.user });
});

//  ROUTE PUBLIQUE
app.get("/", (req, res) => {
  res.send("🚀 API MEAN Stack fonctionne avec SÉCURITÉ avancée !");
});

// CONNEXION MONGODB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(" Connecté à MongoDB");
  server.listen(3000, () => {
    console.log(" Serveur écoute sur http://localhost:3000");
  });
})
.catch((err) => {
  console.error("❌Erreur de connexion à MongoDB :", err);
});

// ===> SOCKET.IO
io.on("connection", (socket) => {
  console.log("Client connecté via WebSocket");
  socket.on("disconnect", () => {
    console.log("Client déconnecté");
  });
});
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
