// Авторизация по JWT: токен выдаётся при входе/регистрации, клиент хранит его
// и отправляет в заголовке Authorization: Bearer <token>
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { HttpError } = require("./httpError");

const JWT_SECRET = process.env.JWT_SECRET || "best-marketplace-dev-secret";
const TOKEN_TTL = "7d";

const createToken = (user) => jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: TOKEN_TTL });
const toPublicUser = (user) => ({ id: user.id, login: user.login });

async function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("Authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new HttpError(401, "Нужно войти в систему"));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return next(new HttpError(401, "Сессия истекла, войдите снова"));
  }

  const user = await User.findByPk(payload.sub);
  if (!user) {
    return next(new HttpError(401, "Пользователь не найден"));
  }
  req.user = user;
  next();
}

module.exports = { createToken, toPublicUser, requireAuth };
