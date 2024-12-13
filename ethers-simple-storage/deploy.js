const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
  );
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy({
    gasLimit: 3000000,
})
//   console.log(contract)
  await contract.deployTransaction.wait(1)
  console.log(`contract address: ${contract.address}`)

  const currentfavouriteNumber = await contract.retreive()
  console.log(`Current favourite number: ${currentfavouriteNumber.toString()}`)

  const transactionResponse = await contract.store("56")
  const transactionReceipt = await transactionResponse.wait(1)
  const updatedFavouriteNumber = await contract.retreive()
  console.log(`Updated favourite number: ${updatedFavouriteNumber}`)

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })