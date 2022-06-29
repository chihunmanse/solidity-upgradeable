import { ethers } from "hardhat";

async function main() {
  const V1 = await ethers.getContractFactory("Version1");
  const v1 = await V1.deploy();
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  const V2 = await ethers.getContractFactory("Version2");
  const v2 = await V2.deploy();
  await v2.deployed();
  console.log("V2 deployed to:", v2.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
