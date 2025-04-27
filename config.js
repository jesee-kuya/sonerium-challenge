require('dotenv').config();
module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  INFURA_API_KEY: process.env.INFURA_API_KEY,
  NETWORK: 'sepolia' // or mainnet
};