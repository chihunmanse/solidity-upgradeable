import { ethers, upgrades } from "hardhat";

async function main() {
  const users = await ethers.getSigners();
  const admin = users[0];
  const v1Users = users.slice(1, 6);
  const v2Users = users.slice(7, 12);

  const V1 = await ethers.getContractFactory("UUPSImplementationV1");
  const v1 = await upgrades.deployProxy(V1, [1], { kind: "uups" });
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  console.log("V1 initialize Count:", await v1.counts(admin.address));

  console.log("V1 ------ V1 users Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await v1.connect(v1Users[i]).count();
    await count.wait();
    console.log(`V1 User${i + 1} count:`, await v1.counts(v1Users[i].address));
  }

  const V2 = await ethers.getContractFactory("UUPSImplementationV2");
  const v2 = await upgrades.upgradeProxy(v1.address, V2, {
    kind: "uups",
    call: { fn: "V2initialize", args: [2] },
  });
  console.log("Upgrade V2");

  console.log("V2 initialize Count:", await v2.counts(admin.address));

  console.log("V2 ------ V1 users second Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await v2.connect(v1Users[i]).count();
    await count.wait();

    console.log(`V1 User${i + 1} count:`, await v2.counts(v1Users[i].address));
  }

  console.log("V2 ------ V2 users Count ------");
  for (let i = 0; i < v2Users.length; i++) {
    const count = await v2.connect(v2Users[i]).count();
    await count.wait();

    console.log(`V2 User${i + 1} count:`, await v2.counts(v2Users[i].address));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
