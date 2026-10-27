const express = require("express");
const { Product } = require("../models");
const { HttpError } = require("../lib/httpError");
const { serializeProduct } = require("../lib/serializers");

const router = express.Router();

const SORT_FIELDS = { title: "title", price: "price" };

// GET /products?search=&sort=title|price&order=asc|desc - доступно без авторизации
router.get("/products", async (req, res) => {
  const search = String(req.query.search ?? "").trim();
  const field = SORT_FIELDS[req.query.sort] ?? "id";
  const direction = req.query.order === "desc" ? "DESC" : "ASC";

  const products = await Product.findAll({ order: [[field, direction], ["id", "ASC"]] });

  // Поиск без учёта регистра делаем в JS: ILIKE в PostgreSQL зависит от локали базы
  // и при некоторых настройках не сравнивает русские буквы разного регистра
  const query = search.toLocaleLowerCase("ru");
  const found = query ? products.filter((product) => product.title.toLocaleLowerCase("ru").includes(query)) : products;

  res.json(found.map((product) => serializeProduct(product)));
});

// GET /products/:id - доступно без авторизации
router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const product = Number.isInteger(id) && id > 0 ? await Product.findByPk(id) : null;
  if (!product) {
    throw new HttpError(404, "Товар не найден");
  }
  res.json(serializeProduct(product, { full: true }));
});

module.exports = router;
