# BestMarketPlace

Интернет-магазин: каталог товаров, корзина, оформление заказов и личный кабинет покупателя.
Fullstack-приложение: клиент на React + TypeScript, сервер на Express + PostgreSQL.

## Возможности

- Каталог товаров с сортировкой и страница товара
- Корзина: добавление, изменение количества, удаление; работает и без входа в аккаунт
- Оформление заказа и история заказов («Мои заказы»)
- Регистрация и вход по JWT, защищённые маршруты
- Формы с валидацией на react-hook-form

## Стек

**Frontend:** React 18, TypeScript (strict, без `any`), Redux + Redux-Saga, React Router, react-hook-form, styled-components
**Backend:** Node.js, Express 5, Sequelize (миграции и сиды), PostgreSQL, JWT, хэширование паролей

## Структура

```
frontend/   React-клиент (pages, components, store: reducers + sagas)
backend/    REST API (routes, models, migrations, seeders)
```

## Запуск

Нужны Node.js, yarn и запущенный PostgreSQL.

```bash
# API: http://localhost:3001
cd backend
yarn install
yarn dbr        # создать базу, применить миграции и заполнить демо-данными
yarn start
```

```bash
# Клиент: http://localhost:3000
cd frontend
yarn install
yarn start
```

Подключение к базе настраивается переменными окружения `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`,
секрет токенов — `JWT_SECRET`, адрес API для клиента — `REACT_APP_API_URL`.

**Демо-аккаунты:** `maria` / `buyer123`, `alex` / `buyer123`
