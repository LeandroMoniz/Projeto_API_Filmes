//models
const Vote = require('../models/vote');
//helpers
const averageUser = async (UserId) => {
    try {
        const votes = await Vote.findAll({
            where: { UserId: UserId },
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
    } catch (error) {
        throw error;
    }
};


module.exports = averageUser; 