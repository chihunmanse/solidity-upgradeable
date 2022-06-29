import { ethers } from "hardhat";

async function main() {
  const users = await ethers.getSigners();
  const v1Users = users.slice(0, 10);
  const v2Users = users.slice(11, 20);

  const V1 = await ethers.getContractFactory("Version1");
  const v1 = await V1.deploy();
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  console.log("V1 ------ V1 users Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await v1.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 User${i} count:`, await v1.counts(v1Users[i].address));
  }

  const setContractActive = await v1.setContractActive(false);
  await setContractActive.wait();

  const V2 = await ethers.getContractFactory("Version2");
  const v2 = await V2.deploy(v1.address);
  await v2.deployed();
  console.log("V2 deployed to:", v2.address);

  console.log("V2 ------ V1 users first Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await v2.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 user${i} count:`, await v2.counts(v1Users[i].address));
  }

  console.log("V2 ------ V2 users first Count ------");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await v2.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 user${i} count:`, await v2.counts(v2Users[i].address));
  }

  console.log("V2 ------ V1 users second Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await v2.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 user${i} count:`, await v2.counts(v1Users[i].address));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
