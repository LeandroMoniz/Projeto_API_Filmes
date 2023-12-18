//models
const Vote = require('../models/vote');
//helpers
const averageMovies = async (movieId) => {
  const votes = await Vote.findAll({
    where: { MovieId: movieId },
  });

  if (votes.length === 0) {
    return 0;
  }
  const sum = votes.reduce((total, vote) => total + vote.Note, 0);
  const division = sum / votes.length;

  const average = {
    AverageNote: division,
    votes: votes.length,
  };

  return average;
};


module.exports = averageMovies; 