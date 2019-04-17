# SamuTokens DApp

This project is an example of how to make a dApp (Application with ethereum). In this case I have created an application that creates bank accounts with a currency or token called samuTokens, it is essential to have metamask in the browser. In this dApp you can create new accounts taking as reference the address of the active account in metamask, you can transfer samu tokens, get the balance of your account and if you are the owner (the account that has deployed the contract) you can increase the samuTokens of the application.

## Starting 🚀

These instructions will allow you to get a copy of the project running on your local machine for development and testing purposes:

Clone the proyect:
```
git clone https://github.com/samuelsan95/samuTokens-DApp.git
```

See **Deployment** to know how to deploy the project.

### Pre-requirements 📋

For can run this proyect you need the next:
- Node (Version 8 or higher)
- Truffle
- Metamask --> https://metamask.io/
- Ganache (For to be able to have fake accounts and import them in metamask)

## Backend - Ethereum

### Installation and Deployment 🔧

The first step open a terminal inside the proyect and go to samuTokens-back folder
```
cd samuTokens-back
```

Then you have to install all the dependencies
```
npm install
```

**NOTE:** Before deploying the contract you need to start ganache

Finally compile and deploy the BankContract with truffle
```
truffle compile
```
```
truffle deploy
```

### Tests ⚙️

Run the tests with truffle, with the next command:
```
truffle test
```

## Frontend - Angular

### Installation and Deployment 🔧

The first step open a terminal inside the proyect and go to samuTokens-front folder
```
cd samuTokens-front
```

Then you have to install all the dependencies
```
npm install
```

Finally you can init the application
```
npm run start
```
