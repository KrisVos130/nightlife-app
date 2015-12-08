'use strict';

var path = process.cwd();

module.exports = function (app, passport) {

	var Auth = require('../config/auth.js');
	var Yelp = require('yelp');
	var yelp = new Yelp(Auth.yelpAuth);
	var User = require('../models/users');

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.json({error: "login"});
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});;

	app.route('/api/yelp')
		.get(function (req, res) {
			var location = req.query.location;
			yelp.search({category_filter: "bars", location: location})
				.then(function (data) {
				  res.json(data);
				})
				.catch(function (err) {
				  res.end(err);
				});
		});
		
	app.route('/api/going/count')
		.get(function (req, res) {
			var id = req.query.id;
			User.count({bars: id}, function(err, c) {
				if (err) { 
					res.status(500);
				} else {
					res.json({amount: c});
				}
			})
		});

	app.route('/api/going')
		.get(isLoggedIn, function (req, res) {
			var id = req.query.id;
			var userId = req.user._id;
			var bars = req.user.bars;
			User.findOne({_id: userId}, function(err, doc) {
				if (doc.bars.indexOf(id) === -1) {
					doc.bars.push(id);
				} else {
					doc.bars.splice(doc.bars.indexOf(id), 1);
				}
				doc.save();
			});
			/*User.count({bars: id}, function(err, c) {
				console.log(err, c);
			})*/
			console.log(id, userId);
			res.end();
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
};
