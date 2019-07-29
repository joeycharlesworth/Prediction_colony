---
title: colony-example-react
section: Examples
order: 2
---

_An example project using [colonyJS](https://github.com/JoinColony/colonyJS) with React!_

This is a built out version of the [colony-starter-react](/colonystarter/starters-colony-starter-react) package with more examples.

## Prerequisites

- Node `>=10.13.0`
- Yarn `>=1.12.0`
- Docker `>=18.09.0`

_You may find it helpful to use Node Version Manager (`nvm`) to manage Node versions._

_If you are using Linux, check out [Linux Setup](/colonystarter/docs-linux-setup/) to ensure Yarn and Docker are set up accordingly._

## Installation

Globally install the [colony-cli](/colonystarter/cli-colony-cli) package.

```
yarn global add @colony/colony-cli
```

Install the `colony-example-react` package.

```
colony build colony-example-react
```

Alternatively, you can use [npx](https://www.npmjs.com/package/npx) and kickstart the `colony-example-react` package in one line without having to add the [colony-cli](/cli-colony-cli) package:

```
npx -p @colony/colony-starter colony build colony-example-react
```

## Start Network

Open a new terminal window and start [Ganache](https://github.com/trufflesuite/ganache-cli):

```
yarn start-ganache
```

## Deploy Contracts

Open a new terminal window and deploy the [colonyNetwork](https://github.com/JoinColony/colonyNetwork) contracts:

```
yarn deploy-contracts
```

## Start TrufflePig

Once the contracts have been deployed, start [TrufflePig](https://github.com/JoinColony/trufflepig):

```
yarn start-trufflepig
```

## Seed Network

Open a new terminal window and run the seed network script:

```
yarn seed-network
```

## Start Server

Once the network has been seeded, start the development server:

```
yarn start
```

## Open Browser

Open your browser and check out the example:

[http://localhost:3000](http://localhost:3000)

## Run Tests

Open a new terminal window and run the example tests:

```
yarn test
```
