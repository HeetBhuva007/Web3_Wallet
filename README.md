# 💰 SolBank – Web-based Solana Wallet

**SolBank** is a secure, Phantom-inspired, web-based wallet for the **Solana blockchain**. Built using **React + Vite**, it enables users to generate wallets, request SOL airdrops (Devnet), send SOL transactions, and manage multiple accounts — all in-browser. It uses a custom **Alchemy RPC server** and handles encrypted key storage securely.

---

## ⚙️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React + Vite + Tailwind CSS          |
| Backend      | Node.js + Express.js + MongoDB + Redis |
| Auth         | JWT-based authentication             |
| Encryption   | AES (via CryptoJS)                   |
| Blockchain   | Solana Devnet via Alchemy RPC        |
| Storage      | MongoDB + Redis                      |

---

## 🚀 Features

- 🔐 Create Solana wallets with seed phrase (shown once only)
- 💳 Add multiple Solana accounts under a single wallet
- 🔒 Private keys are AES-encrypted before storage
- 💸 Airdrop SOL to any public key (Devnet only)
- 🔁 Send SOL to other addresses
- 🔍 View account balance in real-time
- 🔐 Full JWT-based user authentication (register, login, logout)
- 🧠 Custom Alchemy RPC integration for all transactions

---

## 📦 API Endpoints

### 🔐 Authentication

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| POST   | `/register`      | Register a new user          |
| POST   | `/login`         | Log in an existing user      |
| POST   | `/logout`        | Log out the authenticated user |
| GET    | `/check-auth`    | Validate JWT and get user details |

---

### 💼 Wallet Management

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/createWallet`       | Create a new wallet (with seed phrase) |
| POST   | `/createAccount`      | Create a new account under wallet  |
| GET    | `/getWallet`          | Get current wallet for user        |
| GET    | `/getAllAccount`      | Get all accounts under the wallet  |

---

### 💰 Account and Transaction

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| GET    | `/getBalance/:pubKey`        | Fetch SOL balance for account |
| POST   | `/getPrivateKey`             | Decrypt and return private key |

---

### ⚡ Solana Transaction

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/airdrop/:pubKey`    | Airdrop 1 SOL to address (Devnet) |
| POST   | `/sendSol`            | Send SOL from one account to another |

> ⚠️ All endpoints require authentication via JWT (`userMiddleware`) unless otherwise stated.

---

### 1. 🖥️ Setup Backend

```bash
cd Backend
npm install
```
👉 Create a `.env` file inside the `Backend` directory with the required keys mentioned above.

```bash
nodemon src/index.js
```
The backend will run on: `http://localhost:4001`

---

### 2. 💻 Setup Frontend

```bash
cd ../Frontend
npm install
```



```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`
Also change the axiosClient url according to backend url
---

## 💬 Feedback / Contact

Have suggestions or want to contribute?  
Feel free to open an issue or email me at: `heetbhuva1405@gmail.com@gmail.com`

