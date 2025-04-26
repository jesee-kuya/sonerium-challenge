const { SoneiumDeployer } = require('@soneium/sdk');

async function deployTaskManager() {
  const deployer = new SoneiumDeployer('testnet');
  const contract = await deployer.deployContract('TaskManager');
  console.log('Contract deployed at:', contract.address);
}

deployTaskManager();