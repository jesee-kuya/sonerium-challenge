```markdown
# AutoTipper Bot

A simple Telegram bot that lets subscribers tip creators on‐chain with a slash command. Built with Node.js, Telegraf, and ethers.js, it supports ETH (Sepolia testnet) out of the box and can be extended to ERC-20 tokens, NFTs, dashboards, and more.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Setup](#setup)  
3. [Run the Bot](#run-the-bot)  
4. [Deployment](#deployment)  
5. [Usage](#usage)  
6. [Key Considerations](#key-considerations)  
7. [Next Evolution (v2+)](#next-evolution-v2)

---

## Prerequisites

- **Node.js** v18+  
- **Telegram bot** (create via [@BotFather](https://t.me/BotFather))  
- **Infura API key** (sign up at [infura.io](https://infura.io))  
- **Ethereum wallet** (for bot’s funds)  
- **Test ETH** on Sepolia (faucet)

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

# 4. Create environment file
cat > .env <<EOF
BOT_TOKEN=your_telegram_bot_token
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_key
EOF

# 5. Create local SQLite database
touch autotipper.db
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
# Clone your project
git clone https://github.com/jesee-kuya/sonerium-challenge.git
cd autotipper-bot
npm install
```

### Process Management (PM2)

```bash
# Install PM2 globally
npm install pm2 -g

# Start the bot under PM2
pm2 start bot.js --name autotipper-bot
pm2 save
pm2 startup
```

### Security

- Serve your webhook or dashboard over **HTTPS**.  
- **Never** commit `.env` or private keys to version control.  
- Store secrets in a vault (e.g. AWS Secrets Manager).  
- For production, consider using a **Gnosis Safe** multi-sig instead of a single private key.  
- Set up logging, monitoring, and alerting (e.g. with Grafana/Prometheus).

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
  - Never commit secrets or `.env` to Git.  
  - Use a dedicated wallet with limited funds.  
  - Employ multi-sig for large sums.  

- **Gas Fees**  
  - Estimate gas dynamically via `ethers.js`.  
  - Consider layer-2 (Arbitrum, Optimism) for lower fees.  

- **Currency Support**  
  - Extend to ERC-20: accept token contract addresses.  
  - Integrate price oracles (Chainlink) for stablecoin equivalents.

---

## Next Evolution (v2+)

```javascript
// Potential feature roadmap
- Add `/balance` command for creator and user balances
- Implement protocol fee deduction (e.g. 1% per tip)
- Record and expose transaction history
- Build a web dashboard with analytics and leaderboards
- Support multiple chains (Polygon, BSC, Avalanche)
- Mint “Tip Badge” NFTs for top tippers each month
```

---

> **Happy tipping!** 🚀  
```