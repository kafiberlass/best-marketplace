const express = require("express");
const { CartItem, Product } = require("../models");
const { HttpError } = require("../lib/httpError");
const { requireAuth } = require("../lib/auth");
const { serializeCart } = require("../lib/serializers");

const router = express.Router();
router.use("/cart", requireAuth);

const MAX_QUANTITY = 99;

async function getCart(userId) {
  const items = await CartItem.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });
  return serializeCart(items);
}

async function findProduct(productId) {
  const id = Number(productId);
  const product = Number.isInteger(id) && id > 0 ? await Product.findByPk(id) : null;
  if (!product) {
    throw new HttpError(404, "Товар не найден");
  }
  return product;
}

// GET /cart
router.get("/cart", async (req, res) => {
  res.json(await getCart(req.user.id));
});

// POST /cart { productId } - добавить товар (если уже есть - количество +1)
router.post("/cart", async (req, res) => {
  const product = await findProduct(req.body?.productId);
  const [item, created] = await CartItem.findOrCreate({
    where: { userId: req.user.id, productId: product.id },
    defaults: { quantity: 1 },
  });
  if (!created && item.quantity < MAX_QUANTITY) {
    await item.increment("quantity");
  }
  res.status(created ? 201 : 200).json(await getCart(req.user.id));
});

// PUT /cart { productId, quantity } - изменить количество; 0 - убрать товар из корзины
router.put("/cart", async (req, res) => {
  const { productId, quantity } = req.body ?? {};
  const product = await findProduct(productId);
  const count = Number(quantity);
  if (!Number.isInteger(count) || count < 0 || count > MAX_QUANTITY) {
    throw new HttpError(400, `Количество должно быть от 0 до ${MAX_QUANTITY}`);
  }

  const where = { userId: req.user.id, productId: product.id };
  if (count === 0) {
    await CartItem.destroy({ where });
  } else {
    const [item, created] = await CartItem.findOrCreate({ where, defaults: { quantity: count } });
    if (!created) await item.update({ quantity: count });
  }
  res.json(await getCart(req.user.id));
});

module.exports = router;
