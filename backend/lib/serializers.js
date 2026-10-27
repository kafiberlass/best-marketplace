// Приведение данных из БД к виду, который отдаём клиенту
const SHORT_DESCRIPTION_LENGTH = 60;

const shorten = (text) =>
  text.length > SHORT_DESCRIPTION_LENGTH ? `${text.slice(0, SHORT_DESCRIPTION_LENGTH).trimEnd()}…` : text;

const round = (value) => Math.round(value * 100) / 100;

function serializeProduct(product, { full = false } = {}) {
  const data = {
    id: product.id,
    title: product.title,
    shortDescription: shorten(product.description),
    price: product.price,
    photo: product.photo,
  };
  if (full) {
    Object.assign(data, {
      description: product.description,
      vendorName: product.vendorName,
      vendorInfo: product.vendorInfo,
    });
  }
  return data;
}

function serializeCart(cartItems) {
  const items = cartItems
    .map((item) => ({ productId: item.productId, quantity: item.quantity, product: serializeProduct(item.product) }))
    .sort((a, b) => a.product.title.localeCompare(b.product.title, "ru"));

  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: round(items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)),
  };
}

// Статус считается по датам: заказ оформлен -> в пути -> доставлен
function getOrderStatus(order, now = new Date()) {
  if (now >= order.deliveryDate) return "Доставлен";
  const hoursSinceOrder = (now - order.createdAt) / (60 * 60 * 1000);
  return hoursSinceOrder < 24 ? "Оформлен" : "В пути";
}

function serializeOrder(order) {
  return {
    id: order.id,
    address: order.address,
    createdAt: order.createdAt,
    deliveryDate: order.deliveryDate,
    status: getOrderStatus(order),
    total: order.total,
    items: (order.items || []).map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      title: item.product?.title,
      photo: item.product?.photo,
    })),
  };
}

module.exports = { serializeProduct, serializeCart, serializeOrder, round };
