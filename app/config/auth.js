'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	'yelpAuth': {
		'consumer_key': process.env.YELP_CONSUMER_KEY,
		'consumer_secret': process.env.YELP_SECRET_KEY,
		'token': process.env.YELP_TOKEN,
		'token_secret': process.env.YELP_TOKEN_SECRET
	}
};
