const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const factoryArtifact = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json"),
      "utf8"
    )
  );

  const Factory = new ethers.ContractFactory(
    factoryArtifact.abi,
    factoryArtifact.bytecode,
    deployer
  );

  const factory = await Factory.deploy(deployer.address);

  // ✅ 正确等待部署（适配 Ethers v6）
  await factory.waitForDeployment();

  console.log("✅ UniswapV2Factory 部署成功，地址:", await factory.getAddress());
}

main().catch((error) => {
  console.error("❌ 部署失败:", error);
  process.exitCode = 1;
});
