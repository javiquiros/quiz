var models = require('../models/models.js');

var statistics = {};

var errors = [];

// GET /quizes/statistics
exports.calculate = function(req, res, next) {

statistics.media = 0;

models.Quiz.count()
	.then(function(questions) {
			statistics.questions = questions;
			return models.Comment.count();
		})
	.then(function(comments) {
			statistics.comments = comments;
		})
	.then(function() {
		if (statistics.questions != 0) {
			statistics.media = statistics.comments / statistics.questions;
		}
		return models.Comment.aggregate('QuizId', 'count', { distinct: true })
		})
    .then(function(commented) {
    		console.log(commented);
    		statistics.commented = commented;
            statistics.uncommented = statistics.questions - statistics.commented;
    	})
	.catch(function(err) {errors.push(err)})
        .finally(function() {next()});
};

exports.show = function(req, res) {
	res.render('quizes/statistics.ejs', {statistics: statistics, errors: []});
};