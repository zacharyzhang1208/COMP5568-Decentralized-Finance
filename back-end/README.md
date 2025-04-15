# COMP5568DeFi 
Deploy V2Core to the Hardhat network：

npm install @uniswap/v2-core
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install dotenv 
npm install dotenv --save-dev
npx hardhat compile 
npx hardhat node

(open a new window)
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/UniswapV2Factory.js --network localhost
