const axios = require('axios');
//models
const Movie = require('../models/movie');
//helpers
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

    static async createMovie(req, res) {
        // validations
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user.isAdmin == false) {
            sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
            return;
        }


        const { idMovie } = req.query;


        if (!idMovie) {
            sendErrorResponse.fourTwoTwo(errorMessages.erroBusca, res);
        };

        const movieExist = await Movie.findOne({ where: { IdMovie: idMovie } })

        if (movieExist) {
            sendErrorResponse.fourTwoTwo(errorMessages.movieExist, res);
            return;
        }

        const url = `https://www.omdbapi.com/?i=${idMovie}&apikey=${apiKey}`;


        try {
            const response = await axios.get(url);
            if (response.data.Response === 'True') {

                const movies = response.data;

                const dbMovies = {
                    Title: movies.Title,
                    IdMovie: idMovie,
                    Runtime: movies.Runtime,
                    Genre: movies.Genre,
                    Director: movies.Director,
                    Actors: movies.Actors,
                    Poster: movies.Poster,
                    Plot: movies.Plot,
                    IdUser: user.id,
                    bit: true,
                }

                const createMovies = await Movie.create(dbMovies);

                return res.status(200).json({ createMovies });
            } else {
                return res.status(404).json({ error: 'Filmes não encontrados.' });
            }

        } catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }


    }

    static async getMovieDb(req, res) {
        try {
            const movieAll = await Movie.findAll({
                where: { bit: true },
                attributes: [
                    'Title',
                    'IdMovie',
                    'Runtime',
                    'Genre',
                    'Director',
                    'Actors',
                    'Poster',
                    'Plot',
                ],

            });
            res.status(200).json({ movieAll });
        } catch (error) {
            res.status(500).json({
                message: 'Erro interno do servidor',
            });
        }
    }

    static async desativeMovie(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user == null) {
            sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
            return;
        }

        if (user.isAdmin == false) {
            sendErrorResponse.fourTwoTwo(errorMessages.userNotAut, res);
            return;
        }

        const idMovie = req.query.idMovie;
        const bit = false
        console.log("id", user.id)

        await Movie.update({ bit: bit, IdUser: user.id }, { where: { IdMovie: idMovie } });

        sendErrorResponse.twoZero(errorMessages.MovieRemove, res);
        return;

    }







}
