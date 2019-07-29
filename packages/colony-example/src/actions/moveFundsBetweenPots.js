// An example action using the moveFundsBetweenPots method
module.exports = async (colonyClient, fromPot, toPot, amount, token) => {

  // Get the balance of the pot that funds were withdrawn from
  const fromPotBalanceBefore = await colonyClient.getFundingPotBalance.call({
    potId: fromPot,
    token,
  });

  // Get the balance of the pot that funds were deposited into
  const toPotBalanceBefore = await colonyClient.getFundingPotBalance.call({
    potId: toPot,
    token,
  });

  // Move funds between pots
  await colonyClient.moveFundsBetweenPots.send({
    fromPot,
    toPot,
    amount,
    token,
  });

  // Get the balance of the pot that funds were withdrawn from
  const fromPotBalanceAfter = await colonyClient.getFundingPotBalance.call({
    potId: fromPot,
    token,
  });

  // Get the balance of the pot that funds were deposited into
  const toPotBalanceAfter = await colonyClient.getFundingPotBalance.call({
    potId: toPot,
    token,
  });

  // Check out the log to see the balance of the pot that funds were withdrawn from
  console.log('Pot Balance From (Before):', fromPotBalanceBefore.balance.toString());

  // Check out the log to see the balance of the pot that funds were deposited into
  console.log('Pot Balance To (Before):', toPotBalanceBefore.balance.toString());

  // Check out the log to see the balance of the pot that funds were withdrawn from
  console.log('Pot Balance From (After):', fromPotBalanceAfter.balance.toString());

  // Check out the log to see the balance of the pot that funds were deposited into
  console.log('Pot Balance To (After):', toPotBalanceAfter.balance.toString());

  // Return the balance of the pot that funds were deposited into
  return toPotBalanceAfter;

};
