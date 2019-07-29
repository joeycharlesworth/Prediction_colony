const { getNetworkClient } = require('@colony/colony-js-client');
const { open } = require('@colony/purser-software');
const { BN } = require('web3-utils');

(async () => {

  const wallet = await open({
    privateKey: '1514450984BF38DDCDA167AFF44A7A9F6352BF169604CFC0DBDD55FBFF2A4AE5',
  });
  
  const networkClient = await getNetworkClient('goerli', wallet);
  const createTokenTransaction = await networkClient.createToken.send({
    name: 'JamilColony',
    symbol: 'JAMIL',
    decimals: 18,
  })

  const tokenAddress = createTokenTransaction.meta.receipt.contractAddress;
  console.log('Token Address: ', tokenAddress);
  const createColonyResponse = await networkClient.createColony.send({
    tokenAddress,
  })

  const colonyAddress = createColonyResponse.eventData.colonyAddress
  console.log('Colony Address:', colonyAddress);
  const colonyClient = await networkClient.getColonyClientByAddress(colonyAddress);
  
  // Mint tokens
  await colonyClient.tokenClient.mint.send({
    address: colonyAddress,
    amount: new BN('1000000000000000000'),
  });
  

  console.log('Tokens minted!');
  // Claim colony funds
  await colonyClient.claimColonyFunds.send({
    token: tokenAddress,
  });

  console.log('Colony funds claimed!');



  // Add a payment
  const addPaymentResponse = await colonyClient.addPayment.send({
    recipient: wallet.address,
    token: tokenAddress,
    amount: new BN('1000000000000000000'),
    domainId: 1,
  })

  // Set payment id and pot id
  const { paymentId, potId } = addPaymentResponse.eventData;

  // Check out the logs to see the payment data
  console.log('Payment Data:', { paymentId, potId });

  // Move funds  between funding pots
  await colonyClient.moveFundsBetweenPots.send({
    fromPot: 1,
    toPot: potId,
    amount: new BN('1000000000000000000'),
    token: tokenAddress,
  });

console.log('Funds moved to payment pot!');

await colonyClient.finalizePayment.send({ paymentId });

console.log('Payment finalized!');

await colonyClient.claimPayment.send({
  paymentId,
  token: tokenAddress,
});

console.log('Payment claimed!');



})()
  .then(() => process.exit())
  .catch(error => console.error(error));