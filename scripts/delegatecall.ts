import { ethers } from "hardhat";

async function main() {
  const users = await ethers.getSigners();
  const v1Users = users.slice(0, 10);
  const v2Users = users.slice(11, 20);

  const V1 = await ethers.getContractFactory("ImplementationV1");
  const v1 = await V1.deploy();
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  const Proxy = await ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(v1.address);
  await proxy.deployed();
  console.log("Proxy deployed to:", proxy.address);

  console.log("V1 ------ V1 users Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await proxy.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 User${i} count:`, await proxy.counts(v1Users[i].address));
  }

  const V2 = await ethers.getContractFactory("ImplementationV2");
  const v2 = await V2.deploy();
  await v2.deployed();
  console.log("V2 deployed to:", v2.address);

  const versionUp = await proxy.setImplementation(v2.address);
  await versionUp.wait();
  console.log("Set Implementation for V2");

  console.log("V2 ------ V1 users second Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await proxy.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 user${i} count:`, await proxy.counts(v1Users[i].address));
  }

  console.log("V2 ------ V2 users Count ------");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await proxy.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 user${i} count:`, await proxy.counts(v2Users[i].address));
  }

  const V3 = await ethers.getContractFactory("ImplementationV3");
  const v3 = await V3.deploy();
  await v3.deployed();
  console.log("V3 deployed to:", v3.address);

  const versionUp2 = await proxy.setImplementation(v3.address);
  await versionUp2.wait();
  console.log("Set Implementation for V3");

  console.log("V3 ------ Invalid Case");
  console.log("V3 ------ V2 users second Count ------ ");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await proxy.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 user${i} count:`, await proxy.counts(v2Users[i].address));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
