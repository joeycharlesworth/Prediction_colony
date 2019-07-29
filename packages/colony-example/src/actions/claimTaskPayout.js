// An example action using the "claimTaskPayout" method
module.exports = async (colonyClient, taskId, role, token) => {

  // Get the task payout
  const taskPayoutBefore = await colonyClient.getTaskPayout.call({
    taskId,
    role,
    token,
  });

  // Claim the task payout
  await colonyClient.claimTaskPayout.send({
    taskId,
    role,
    token,
  });

  // Get the task payout
  const taskPayoutAfter = await colonyClient.getTaskPayout.call({
    taskId,
    role,
    token,
  });

  // Check out the logs to see the task payout amount before it was claimed
  console.log('Task Payout (Before): ' + taskPayoutBefore.amount);

  // Check out the logs to see the task payout amount after it was claimed
  console.log('Task Payout (After): ' + taskPayoutAfter.amount);

  // Return the task payout amount after it was claimed
  return taskPayoutAfter;

};
