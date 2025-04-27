```markdown
# AutoTipper Bot v1.0.0

A simple Telegram bot that lets subscribers tip creators on‐chain with a slash command. Built with Node.js, Telegraf, and ethers.js, it supports ETH (Sepolia testnet) out of the box and can be extended to ERC-20 tokens, NFTs, dashboards, and more.

---

## Version

- **v1.0.0** — Initial MVP with ETH tipping on Sepolia testnet

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Setup](#setup)  
3. [Database Schema](#database-schema)  
4. [Bot Entry-Point (bot.js)](#bot-entry-point-botjs)  
5. [Run the Bot](#run-the-bot)  
6. [Deployment](#deployment)  
7. [Usage](#usage)  
8. [Key Considerations](#key-considerations)  
9. [Next Evolution (v2+)](#next-evolution-v2)

---

## Prerequisites

- **Node.js** v18+  
- **Telegram bot** (create via [@BotFather](https://t.me/BotFather))  
- **Infura Project ID** (sign up at [infura.io](https://infura.io))  
- **Ethereum wallet** (for bot’s funds)  
- **Test ETH** on Sepolia (use a faucet)

---

## Setup

```bash
# 1. Create project directory
mkdir autotipper-bot
cd autotipper-bot

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install telegraf ethers sqlite3 dotenv

# 4. Create .env file
cat > .env <<EOF
BOT_TOKEN=your_telegram_bot_token
PRIVATE_KEY=your_wallet_private_key
INFURA_PROJECT_ID=your_infura_project_id
NETWORK=sepolia
EOF

# 5. Create local SQLite database file
touch autotipper.db
```

---

## Database Schema

In `autotipper.db` we use two simple tables:

```sql
-- Creators who register their wallet
CREATE TABLE IF NOT EXISTS creators (
  telegram_id   TEXT PRIMARY KEY,
  eth_address   TEXT NOT NULL,
  registered_at INTEGER NOT NULL
);

-- Tips logged by the bot
CREATE TABLE IF NOT EXISTS tips (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tipper_id     TEXT NOT NULL,
  creator_id    TEXT NOT NULL,
  amount_wei    TEXT NOT NULL,
  tx_hash       TEXT NOT NULL,
  timestamp     INTEGER NOT NULL
);
```

---

## Bot Entry-Point (bot.js)

```js
// bot.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();

// --- Initialize ---
const bot = new Telegraf(process.env.BOT_TOKEN);
const db  = new sqlite3.Database('autotipper.db');

// --- Ethereum provider & wallet ---
const provider = new ethers.providers.InfuraProvider(
  process.env.NETWORK,
  process.env.INFURA_PROJECT_ID
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// --- Handlers (register, tip) ---
bot.command('register', async (ctx) => {
  const ethAddr = ctx.message.text.split(' ')[1];
  // Insert into creators table…
  ctx.reply(`Registered ${ethAddr}`);
});

bot.command('tip', async (ctx) => {
  const amountEth = ctx.message.text.split(' ')[1];
  // Send transaction, record in tips table…
  ctx.reply(`Tipped ${amountEth} ETH`);
});

// --- Start polling ---
bot.launch();
```

---

## Run the Bot

```bash
node bot.js
```

---

## Deployment

### Server Setup (Ubuntu)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm -y
```

```bash
# Clone project repo
git clone https://github.com/yourusername/autotipper-bot.git
cd autotipper-bot
npm install
```

### Process Management (PM2)

```bash
npm install pm2 -g
pm2 start bot.js --name autotipper-bot
pm2 save
pm2 startup
```

### Security

- Serve webhooks/dashboard over **HTTPS**.  
- **Never** commit `.env` or private keys to Git.  
- Store secrets in a vault (e.g. AWS Secrets Manager).  
- Consider using a **Gnosis Safe** multisig for production funds.  
- Set up logging, monitoring, and alerting (e.g. Grafana + Prometheus).

---

## Usage

1. **Creator registration**  
   ```text
   /register 0xYourEthereumAddress
   ```

2. **Subscriber tipping** (reply to creator’s message)  
   ```text
   /tip 0.01
   ```

---

## Key Considerations

- **Security**  
  - Keep secrets out of version control.  
  - Use a dedicated wallet with limited funds.  
  - Employ multisig for significant balances.  

- **Gas Fees**  
  - Estimate gas dynamically via `ethers.js`.  
  - Evaluate Layer-2 networks (Arbitrum, Optimism).  

- **Currency Support**  
  - Extend to ERC-20: accept token contract addresses.  
  - Integrate Chainlink oracles for USD-pegged tipping.

---

## Next Evolution (v2+)

```javascript
// Feature roadmap
- Add `/balance` command for user & creator balances
- Implement a 1% protocol fee on each tip
- Record & expose tip history in a web dashboard
- Mint “Tip Badge” NFTs for top tippers monthly
- Support multiple chains (Polygon, BSC, Avalanche)
- On-chain Tip smart contract with events for The Graph indexing
```

---

> **Happy tipping!** 🚀  
```