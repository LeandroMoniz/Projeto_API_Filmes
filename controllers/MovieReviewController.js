
const axios = require('axios')
const errorMessages = require('../public/errorMessages/errorMessages');
const sendErrorResponse = require('../helpers/sendErrorResponse');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const apiKey = process.env.YOUR_API_KEY;

module.exports = class MovieReviewController {

    static async getMovie(req, res) {
        const { busca } = req.query;

        // validations

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user.isAdmin == false) {
            sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
            return;
        }

        if (!busca) {
            sendErrorResponse.fourTwoTwo(errorMessages.erroBusca, res);
        };

        const url = `https://www.omdbapi.com/?s=${busca}&apikey=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.Response === 'True') {
                const movies = response.data.Search;
                return res.status(200).json({ movies });
            } else {
                return res.status(404).json({ error: 'Filmes não encontrados.' });
            }

        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    static async getByIdMovie(req, res) {
        const { idMovie } = req.query;

        // validations

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user.isAdmin == false) {
            sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
            return;
        }

        if (!idMovie) {
            sendErrorResponse.fourTwoTwo(errorMessages.erroBusca, res);
        };

        const url = `https://www.omdbapi.com/?i=${idMovie}&apikey=${apiKey}`;

        try {
            const response = await axios.get(url);
            console.log("filme", response.data)
            if (response.data.Response === 'True') {
                const movies = response.data;
                return res.status(200).json({ movies });
            } else {
                return res.status(404).json({ error: 'Filmes não encontrados.' });
            }

        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }








}