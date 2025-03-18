# CryptoVote

## Sample Hardhat Run

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


## Start Node Project

Install on [nvm install](https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/)

```bash
npm init

nvm install 20
nvm use 20

npm install --save-dev hardhat
npx hardhat init
# select typescript

# install env lib
npm i dotenv 
# install openzeppelin
npm install @openzeppelin/contracts
```

## Run HardHat

```bash
npx hardhat compile

#run local node
npx hardhat node

# test deploy
npx hardhat ignition deploy ./ignition/modules/deploy.ts
#deploy to local node
npx hardhat run ignition/modules/deploy.ts --network localhost

# deploy to sepolia
npx hardhat run ignition/modules/deploy.ts --network sepolia
```

## Run unit test

```bash
npx hardhat test
```



