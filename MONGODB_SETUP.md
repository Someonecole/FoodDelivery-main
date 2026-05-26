# MongoDB setup

This version uses MongoDB for accounts, sessions, profiles, and orders. Firebase was removed from the app code.

## 1. Install dependencies

```bash
npm install
```

This regenerates the lock file and installs the MongoDB driver.

## 2. Create local environment file

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in your MongoDB Atlas URI and create a long random `AUTH_SECRET`.

```env
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.xyxm4vf.mongodb.net/fooddelivery?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=fooddelivery
AUTH_SECRET=replace-with-a-long-random-secret
```

Generate an auth secret with:

```bash
openssl rand -base64 32
```

## 3. MongoDB Atlas settings

In MongoDB Atlas:

1. Create a database user.
2. Add your local IP address in Network Access.
3. For Vercel deployments, add Vercel-compatible access. For a simple demo, `0.0.0.0/0` works, but it is less restrictive.
4. Use the database name `fooddelivery`.

Collections are created automatically:

- `users`
- `orders`

## 4. Run locally

```bash
npm run dev
```

## 5. Deploy on Vercel

Add these environment variables in Vercel Project Settings:

```env
MONGODB_URI=
MONGODB_DB=fooddelivery
AUTH_SECRET=
```

Then redeploy.

## 6. Pages

- Storefront: `/`
- Login/create account: `/login`
- Account profile and order history: `/account`
- Checkout: `/checkout`
- Track order: `/track-order?orderId=ORDER_ID`
- Demo admin orders page: `/admin/orders`

## Security notes

- Do not commit `.env.local`.
- Rotate any MongoDB password that was pasted into chat or committed anywhere.
- The demo admin page is not protected. Add an admin-only check before using this for production.
