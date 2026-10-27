const express = require("express");
const { sequelize, CartItem, Order, OrderItem, Product } = require("../models");
const { HttpError } = require("../lib/httpError");
const { requireAuth } = require("../lib/auth");
const { serializeOrder, round } = require("../lib/serializers");

const router = express.Router();
router.use("/my-orders", requireAuth);

const DELIVERY_DAYS = 3;
const SORT_FIELDS = { date: "createdAt", price: "total" };
const orderInclude = [{ model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] }];

// GET /my-orders?sort=date|price&order=asc|desc
router.get("/my-orders", async (req, res) => {
  const field = SORT_FIELDS[req.query.sort] ?? "createdAt";
  const direction = req.query.order === "asc" ? "ASC" : "DESC";

  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: orderInclude,
    order: [[field, direction], ["id", direction]],
  });
  res.json(orders.map(serializeOrder));
});

// POST /my-orders { address } - оформить заказ из корзины. Корзина после этого очищается
router.post("/my-orders", async (req, res) => {
  const address = String(req.body?.address ?? "").trim();

  const orderId = await sequelize.transaction(async (transaction) => {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "product" }],
      transaction,
    });
    if (cartItems.length === 0) {
      throw new HttpError(400, "Корзина пуста");
    }

    const total = round(cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0));
    const deliveryDate = new Date(Date.now() + DELIVERY_DAYS * 24 * 60 * 60 * 1000);
    const order = await Order.create({ userId: req.user.id, address, deliveryDate, total }, { transaction });

    await OrderItem.bulkCreate(
      cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
      { transaction }
    );
    await CartItem.destroy({ where: { userId: req.user.id }, transaction });
    return order.id;
  });

  res.status(201).json(serializeOrder(await Order.findByPk(orderId, { include: orderInclude })));
});

module.exports = router;
