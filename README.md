# D&D Character Manager

Веб-додаток для керування персонажами настільних рольових ігор Dungeons & Dragons.

## Технології
- Node.js + Express.js
- TypeScript (strict mode)
- MongoDB + Mongoose
- EJS шаблонизатор
- express-session для сесій

## Встановлення

```bash
npm install
cp .env.example .env
# Налаштувати MongoDB URI у .env
npm run dev
```

## Скрипти

- `npm run dev` - Запуск у режимі розробки
- `npm run build` - Компіляція TypeScript
- `npm run lint` - Лінтинг коду
- `npm test` - Запуск тестів з покриттям

## Сторінки

1. **Головна** (`/`) - Публічна
2. **Вхід** (`/login`) - Автентифікація
3. **Реєстрація** (`/register`) - Автентифікація
4. **Персонажі** (`/characters`) - З аутентифікацією

## Автор
[Денисюк Денис], [ВТ23-2]