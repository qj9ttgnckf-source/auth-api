const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const PORT = 3004;
const SECRET = "6NA546Jcfgbf854b"; 

// файл где хранятся пользователи
const DB_FILE = "./users.json";

// если файла нет то создаём
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// читае т пользователей
function readUsers() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// сохраняет пользователей
function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ ok: false, error: "login and password required" });
  }

  const users = readUsers();

  // проверка что нет такого логина
  if (users.find((u) => u.login === login)) {
    return res.status(400).json({ ok: false, error: "user already exists" });
  }

  // хешируем пароль
  const hash = bcrypt.hashSync(password, 8);

  users.push({ login, password: hash });
  saveUsers(users);

  res.json({ ok: true, message: "registered" });
});

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.login === login);

  if (!user) {
    return res.status(400).json({ ok: false, error: "wrong login" });
  }

  // сравниваем пароль
  const valid = bcrypt.compareSync(password, user.password);

  if (!valid) {
    return res.status(400).json({ ok: false, error: "wrong password" });
  }

  // создаём токен
  const token = jwt.sign({ login: user.login }, SECRET, { expiresIn: "1h" });

  res.json({ ok: true, token });
});

function auth(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ ok: false, error: "no token" });
  }

  const token = header.split(" ")[1];

  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "invalid token" });
  }
}

app.get("/me", auth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.listen(PORT, () => {
  console.log("Auth API running on http://127.0.0.1:" + PORT);
});
