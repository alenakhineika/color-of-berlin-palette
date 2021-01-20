import Twitter from 'twitter';
import util from 'util';
import dotenv from 'dotenv';

type GetTweets = (
  arg1: string,
  arg2: { screen_name: string; count: number; page: number },
) => Promise<any>;

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const client: Twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY || '',
  consumer_secret: process.env.TWITTER_CONSUMER_API_KEY_SECRET || '',
  access_token_key: process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN || '',
  access_token_secret:
    process.env.TWITTER_AUTHENTICATION_ACCESS_TOKEN_SECRET || '',
});

const fetchTweetsForPage = async (
  page: number,
): Promise<Twitter.ResponseData[]> => {
  const getTweets: GetTweets = util.promisify(client.get.bind(client));

  return await getTweets('statuses/user_timeline', {
    screen_name: 'colorofberlin',
    count: 200,
    page,
  });
};

const getColorsOfBerlin = async (numberOfPages: number): Promise<any[]> => {
  let tweets: Twitter.ResponseData[] = [];

  for (let i = 1; i <= numberOfPages; i++) {
    const tweetsPerPage: Twitter.ResponseData[] = await fetchTweetsForPage(i);

    if (tweetsPerPage.length > 0) {
      tweets = tweets.concat(tweetsPerPage);
    } else {
      return tweets;
    }
  }

  return tweets;
};

(async () => {
  try {
    const colors: any[] = await getColorsOfBerlin(1);

    console.log('colors----------------------');
    console.log(colors);
    console.log('----------------------');
  } catch (error) {
    console.error(error);
  }
})();
