# Project

## Run project

- Backend

```bash
# Run node
npx hardhat node
# Install dependencies
npm install --save-dev hardhat
# Deploy contract
npx hardhat ignition deploy ./ignition/modules/deploy.ts --network localhost

# Run tests
npx hardhat compile
npx hardhat test
```

- Frontend

Metre à jour dans le fichier *frontend\constants\index.js*

Abi de : *backend\artifacts\contracts\SimpleStorage.sol\SimpleStorage.json - "abi"*

```js
export const abi = [...]
export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
```

```bash
# Install dependencies
npm install
# Run the development server
npm run dev

# Build the project
npm run build
```

## Backend

- make solidity contract in /contracts/Voting.sol
- make deploy.ts in /ignition/modules/deploy.ts
    - pass admin adress to contract constructor
- make test in /test/Voting.ts
- make run profil in backend\hardhat.config.ts
- make .env file with RPC_URL, PRIVATE_KEY and ETHERSCAN_API_KEY
- deploy local node
- deploy ignition



## Frontend

- make constants/index.js
    - export const abi = [...]
    - export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

