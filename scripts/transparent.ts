import { ethers, upgrades } from "hardhat";

const V1ABI = [
  "function initiallize(uint256 _count)",
  "function count()",
  "function counts(address) view returns (uint256)",
];

async function main() {
  const users = await ethers.getSigners();
  const admin = users[0];
  const v1Users = users.slice(0, 5);
  const v2Users = users.slice(6, 10);

  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  console.log("ProxyAdmin deployed to:", proxyAdmin.address);

  const V1 = await ethers.getContractFactory("TransparentImplementationV1");
  const v1 = await V1.deploy();
  await v1.deployed();
  console.log("V1 deployed to:", v1.address);

  const iface = new ethers.utils.Interface([
    "function initiallize(uint256 _count)",
  ]);
  const callData = iface.encodeFunctionData("initiallize", [1]);
  const TransparentProxy = await ethers.getContractFactory(
    "TransparentUpgradeableProxy"
  );
  const transparentProxy = await TransparentProxy.deploy(
    v1.address,
    proxyAdmin.address,
    callData
  );
  await transparentProxy.deployed();
  console.log("TransparentProxy deployed to:", transparentProxy.address);

  let proxy = new ethers.Contract(transparentProxy.address, V1ABI, admin);

  console.log("V1 initiallize Count:", await proxy.counts(users[0].address));

  console.log("V1 ------ V1 users Count ------");
  for (let i = 0; i < v1Users.length; i++) {
    const count = await proxy.connect(v1Users[i]).count();
    await count.wait();
    console.log(`V1 User${i} count:`, await proxy.counts(v1Users[i].address));
  }

  const V2 = await ethers.getContractFactory("TransparentImplementationV2");
  proxy = await upgrades.upgradeProxy(transparentProxy.address, V2, {
    kind: "transparent",
    call: { fn: "initiallize", args: [1] },
  });
  console.log("Upgrade V2");

  console.log("V2 initiallize Count:", await proxy.counts(proxyAdmin.address));

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

  console.log("proxyAdmin:", proxyAdmin.address);
  console.log(
    "admin() from proxyAdmin",
    await proxyAdmin.getProxyAdmin(proxy.address)
  );

  console.log("users[0]", users[0].address);
  console.log("admin() from users[0]", await proxy.admin());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
