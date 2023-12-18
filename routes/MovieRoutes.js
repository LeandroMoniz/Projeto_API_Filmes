const router = require('express').Router();
// middleware
const verifyToken = require('../helpers/verify-token');

const MovieReviewController = require('../controllers/MovieReviewController');
const VoteController = require('../controllers/VoteController');
//Movies

router.get('/movies', verifyToken, MovieReviewController.getMovie);
router.get('/moviesById', verifyToken, MovieReviewController.getByIdMovie);
router.post('/create', verifyToken, MovieReviewController.createMovie);
router.get('/movieAll', MovieReviewController.getMovieDb);
router.patch('/deactivation', verifyToken, MovieReviewController.desativeMovie);

//vote
router.post('/createVote', verifyToken, VoteController.createVote);

module.exports = router;