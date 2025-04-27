const { Telegraf } = require('telegraf');
const { ethers } = require('ethers');
const config = require('./config');
const db = require('./db');

// Setup Ethereum provider
const provider = new ethers.InfuraProvider(config.NETWORK, config.INFURA_API_KEY);
const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const bot = new Telegraf(config.BOT_TOKEN);

// Register command
bot.command('register', async (ctx) => {
  const userId = ctx.from.id;
  const address = ctx.message.text.split(' ')[1];
  
  if (!ethers.isAddress(address)) {
    return ctx.reply('Invalid Ethereum address');
  }

  db.run(
    'REPLACE INTO creators (user_id, wallet_address) VALUES (?, ?)',
    [userId, address],
    (err) => {
      if (err) return ctx.reply('Registration failed');
      ctx.reply('Wallet registered successfully!');
    }
  );
});

// Tip command
bot.command('tip', async (ctx) => {
  const [amountStr] = ctx.message.text.split(' ').slice(1);
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount)) return ctx.reply('Invalid amount');

  // Get creator's address
  db.get(
    'SELECT wallet_address FROM creators WHERE user_id = ?',
    [ctx.message.reply_to_message.from.id],
    async (err, row) => {
      if (err || !row) return ctx.reply('Creator not registered');
      
      try {
        const tx = await wallet.sendTransaction({
          to: row.wallet_address,
          value: ethers.parseEther(amountStr)
        });
        
        ctx.reply(`Tip sent! Transaction hash: ${tx.hash}`);
      } catch (error) {
        ctx.reply('Tip failed: ' + error.message);
      }
    }
  );
});

bot.launch();
console.log('Bot started');