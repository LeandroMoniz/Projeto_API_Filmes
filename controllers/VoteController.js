//models
const Vote = require('../models/vote');
const Movie = require('../models/movie');
const User = require('../models/user');
//helpers
const errorMessages = require('../public/errorMessages/errorMessages');
const sendErrorResponse = require('../helpers/sendErrorResponse');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class VoteController {

    static async createVote(req, res) {
        try {

            const token = getToken(req);
            const UserID = await getUserByToken(token);
            const IdUser = UserID.id

            const { note, IdMovie } = req.body

            if (note < 0 || note > 4) {
                sendErrorResponse.fourTwoTwo(errorMessages.voteError, res);
                return;
            }

            const movie = await Movie.findByPk(IdMovie);
            const user = await User.findByPk(IdUser);

            if (!movie || movie == null || movie.bit == false) {
                sendErrorResponse.fourTwoTwo(errorMessages.movieNot, res);
                return;
            }

            const oneVote = await Vote.findOne({
                where: { UserId: IdUser, MovieId: IdMovie }
            })
            if (oneVote) {
                sendErrorResponse.fourTwoTwo(errorMessages.voteOne, res);
                return;
            } else {
                const vote = await Vote.create({ Note: note });

                await user.addVote(vote);
                await movie.addVote(vote);

                sendErrorResponse.twoZero(errorMessages.voteCreate, res)
                return;
            }

        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            res.status(500).json({
                message: 'Erro interno do servidor',
            });
        }

    }

    static async averageMovie(req, res) {

    }
}