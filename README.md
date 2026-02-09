# Auth API

Простой сервер с регистрацией и JWT авторизацией

## Установка

```bash
npm install
```

## Запуск

```bash
npm start
```

Сервер: http://127.0.0.1:3004

## Регистрация

```bash
curl -X POST http://127.0.0.1:3004/register \
 -H "Content-Type: application/json" \
 -d '{"login":"admin","password":"1234"}'
```

## Логин

```bash
curl -X POST http://127.0.0.1:3004/login \
 -H "Content-Type: application/json" \
 -d '{"login":"admin","password":"1234"}'
```

## /me только с токеном

```bash
curl http://127.0.0.1:3004/me \
 -H "Authorization: Bearer TOKEN_HERE"
```
