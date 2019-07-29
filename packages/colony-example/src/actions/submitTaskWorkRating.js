// Import the prerequisites
const { sha3 } = require('web3-utils');

// An example action using the "submitTaskWorkRating" method
module.exports = async (colonyClient, taskId, role, rating) => {

  // Set salt value
  const salt = sha3('secret');

  // Set rating value
  const value = rating;

  // Generate a secret for the work rating
  const { secret } = await colonyClient.generateSecret.call({
    salt,
    value,
  });

  // Submit task work rating for the given task and role
  const submitTaskWorkRating = await colonyClient.submitTaskWorkRating.send({
    taskId,
    role,
    secret,
  });

  // Get the task work ratings
  const taskWorkRatings = await colonyClient.getTaskWorkRatingSecretsInfo.call({
    taskId,
  });

  // Check out the logs to see the task work ratings
  console.log('Task Work Ratings:', taskWorkRatings);

  // Get the task role
  const taskRole = await colonyClient.getTaskRole.call({
    taskId,
    role,
  });

  // Check out the logs to see the task role
  console.log('Task Role:', taskRole);

  // Return the task work ratings
  return taskWorkRatings;

};
