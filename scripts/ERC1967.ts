import { ethers } from "hardhat";
import { expect } from "chai";

const V1ABI = [
  "function count()",
  "function counts(address) view returns (uint256)",
];

const V3ABI = ["function upgradeTo(address)"];

const V4ABI = [
  "function count()",
  "function counts(address) view returns (uint256)",
  "function storageTest(address)",
  "function getAddress() view returns (address)",
];

async function main() {
  const users = await ethers.getSigners();
  const v1Users = users.slice(0, 5);
  const v2Users = users.slice(6, 10);

  const V1 = await ethers.getContractFactory("ERC1967ImplementationV1");
  const v1 = await V1.deploy();
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  const ERC1967Proxy = await ethers.getContractFactory("ERC1967");
  const erc1967Proxy = await ERC1967Proxy.deploy(v1.address, "0x");
  await erc1967Proxy.deployed();
  console.log("ERC1967Proxy deployed to:", erc1967Proxy.address);

  let proxy = new ethers.Contract(erc1967Proxy.address, V1ABI, users[0]);

  console.log("V1 ------ V1 users Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await proxy.connect(v1Users[i]).count();
    await count.wait();
    console.log(`V1 User${i} count:`, await proxy.counts(v1Users[i].address));
  }

  const V2 = await ethers.getContractFactory("ERC1967ImplementationV2");
  const v2 = await V2.deploy();
  await v2.deployed();
  console.log("V2 deployed to:", v2.address);

  const versionUp = await erc1967Proxy.upgradeTo(v2.address);
  await versionUp.wait();
  console.log("Upgrade V2");

  console.log("V2 ------ V1 users second Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await proxy.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 User${i} count:`, await proxy.counts(v1Users[i].address));
  }

  console.log("V2 ------ V2 users Count ------");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await proxy.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 User${i} count:`, await proxy.counts(v2Users[i].address));
  }

  const V3 = await ethers.getContractFactory("ERC1967ImplementationV3");
  const v3 = await V3.deploy();
  await v3.deployed();
  console.log("V3 deployed to:", v3.address);

  const versionUp2 = await erc1967Proxy.upgradeTo(v3.address);
  await versionUp2.wait();
  console.log("Upgrade V3");

  proxy = new ethers.Contract(erc1967Proxy.address, V3ABI, users[0]);

  console.log("V3 ------ upgradeTo function Error ------");
  await expect(proxy.upgradeTo(users[0].address)).to.be.revertedWith(
    "ERC1967: new implementation is not a contract"
  );

  const V4 = await ethers.getContractFactory("ERC1967ImplementationV4");
  const v4 = await V4.deploy();
  await v4.deployed();
  console.log("V4 deployed to:", v4.address);

  const versionUp3 = await erc1967Proxy.upgradeTo(v4.address);
  await versionUp3.wait();
  console.log("Upgrade V4");

  proxy = new ethers.Contract(erc1967Proxy.address, V4ABI, users[0]);

  console.log("V4 ------ V2 users second Count ------");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await proxy.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 User${i} count:`, await proxy.counts(v2Users[i].address));
  }

  console.log("V4 ------ storage test ------");
  const storageTest = await proxy.storageTest(users[0].address);
  await storageTest.wait();
  console.log("users[0]:", users[0].address);
  console.log("implementation:", await erc1967Proxy.implementation());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
