const express = require("express");
const path = require("path");
const staticRouter = require("./routes/staticRouter");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const { requireAuth, checkUser } = require("./middlewares/authMiddlewares");
const Message = require("./models/Message");

// Variables:
const dbUrl =
  "mongodb+srv://mughalzain1995:test123@cluster0.fli62vt.mongodb.net/portfolio";
const PORT = 3000;

// Initialize App
const app = express();

// Connect to DB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log(`MongoDB connected to port-${PORT}`);
  })
  .catch(() => {
    console.log("Server Connection Failed!");
  });

// Set Default View Folder and Views to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use Static (CSS files) from public
app.use(express.static("public"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// authRouter
app.get("*", checkUser);
app.get("/download-pdf", requireAuth, (req, res) => {
  res.redirect(
    "https://drive.google.com/file/d/11Ax3dlFT0oLUx8n-Ini5CNuhrA1onlpc/view"
  );
});
app.get("/send-message", requireAuth, (req, res) => {
  res.render("send-message");
});
app.post("/send-message", async (req, res) => {
  const { head, body } = req.body;

  console.log("name of the user:", req.body);
  try {
    const message = await Message.create({ head, body });
    res.json({ message: "sent" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Notsent" });
  }
});

app.get("/faq", (req, res) => {
  res.render("faq");
});

// Routes
app.use(staticRouter);
app.use(authRouter);

// Listen to PORT 3000
app.listen(PORT, () => {
  console.log("Server started");
});
