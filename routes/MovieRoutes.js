const router = require('express').Router();
// middleware
const verifyToken = require('../helpers/verify-token');

const MovieReviewController = require('../controllers/MovieReviewController');

//Movies

router.get('/movies', verifyToken, MovieReviewController.getMovie);
router.get('/moviesById', verifyToken, MovieReviewController.getByIdMovie);
router.post('/create', verifyToken, MovieReviewController.createMovie);
router.get('/movieAll', MovieReviewController.getMovieDb);
router.patch('/deactivation', verifyToken, MovieReviewController.desativeMovie);


module.exports = router;