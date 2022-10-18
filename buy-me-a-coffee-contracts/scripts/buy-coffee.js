// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function printBalances(addresses) {
  addresses.forEach(async (address, idx) => {
    console.log(`${address} ${idx} balance: ${await getBalance(address)}`);
  });
}

async function printMemos(memos) {
  memos.forEach((memo) => {
    console.log(`${memo.name} (${memo.from}) said: ${memo.message} at ${memo.timestamp}`);
  });
}

async function main() {
  // Get example accounts.
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract and deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

  // Check balances before the coffee purchase.
  console.log("=== Balances before the coffee purchase ===");
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  await printBalances(addresses);
  
  // Tip the owner.
  const options = { value: hre.ethers.utils.parseEther("0.1") };
  await buyMeACoffee.connect(tipper1).buyCoffee("J", "Thanks for the great tutorial!", options);
  await buyMeACoffee.connect(tipper2).buyCoffee("K", "Woot!", options);
  await buyMeACoffee.connect(tipper3).buyCoffee("T", "Cheers!", options);

  // Check balances after the coffee purchase.
  console.log("=== Balances after the coffee purchase ===");
  await printBalances(addresses);

  // Withdraw tips.
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balances after the tips are withdrawn.
  console.log("=== Balances after the tips are withdrawn ===");
  await printBalances(addresses);

  // Read memos.
  console.log("=== Memos ===");
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos);

  // Change the owner.
  console.log("=== Changing the owner ===");
  await buyMeACoffee.connect(owner).changeOwner(tipper1.address);
  // console.log("New owner:", await buyMeACoffee.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
