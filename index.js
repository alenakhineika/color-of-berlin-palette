const Twitter = require('twitter');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_API_KEY_SECRET,
  access_token_key: process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN_SECRET,
});

const getColorOfBerlin = () => {
  client.get('statuses/user_timeline', { screen_name: 'colorofberlin', count: 200 }, function(error, tweets, response) {
    console.log('error----------------------');
    console.log(error);
    console.log('----------------------');
    console.log('tweets----------------------');
    console.log(JSON.stringify(tweets, null, 2));
    console.log('----------------------');
    console.log('length----------------------');
    console.log(tweets.length);
    console.log('----------------------');
  });
}

getColorOfBerlin();
