const Twitter = require('twitter');
const util = require('util');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_API_KEY_SECRET,
  access_token_key: process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN_SECRET,
});

const fetchTweetsForPage = async (page) => {
  const getTweets = util.promisify(
    client.get.bind(client)
  );

  return await getTweets('statuses/user_timeline', { screen_name: 'colorofberlin', count: 200, page });
}

const getColorsOfBerlin = async (numberOfPages) => {
  let tweets = [];

  for (let i = 1; i <= numberOfPages; i++) {
    const tweetsPerPage = await fetchTweetsForPage(i);

    if (tweetsPerPage.length > 0) {
      tweets = tweets.concat(tweetsPerPage);
    } else {
      return tweets;
    }
  };
}

(async () => {
  try {
    const colors = await getColorsOfBerlin(100);

    console.log('length----------------------');
    console.log(colors.length);
    console.log('----------------------');
  } catch (error) {
    console.error(error);
  }
})();