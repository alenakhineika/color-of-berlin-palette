import dotenv from 'dotenv';
import ora from 'ora';
import Twitter from 'twitter';
import util from 'util';

type LastSavedTweet = {
  id: string,
  created_at: string
};

const envConstants = process.env.NODE_ENV !== 'production'
  ? dotenv.config().parsed
  : process.env;
const twitterOptions: Twitter.BearerTokenOptions = {
  consumer_key: envConstants?.TWITTER_API_CONSUMER_KEY || '',
  consumer_secret: envConstants?.TWITTER_API_CONSUMER_SECRET || '',
  bearer_token: envConstants?.TWITTER_BEARER_TOKEN || '',
};

type TwitterParams = { screen_name: string; count: number; page: number, since_id?: string };

type GetTweets = ( arg1: string, arg2: TwitterParams ) => Promise<any>;

const client: Twitter = new Twitter(twitterOptions);

const _fetchTweetsForPage = (data: {
  page: number,
  lastSavedTweet?: LastSavedTweet
}): Promise<Twitter.ResponseData[]> => {
  const { page, lastSavedTweet } = data;
  const getTweets: GetTweets = util.promisify(client.get.bind(client));

  const twitterParameters: TwitterParams = {
    screen_name: 'colorofberlin',
    count: 200,
    page
  };

  if (lastSavedTweet) {
    twitterParameters.since_id = lastSavedTweet.id;
  }

  return getTweets('statuses/user_timeline', twitterParameters);
};

const fetchTweets = async (lastSavedTweet?: LastSavedTweet): Promise<Twitter.ResponseData[]> => {
  let tweets: Twitter.ResponseData[] = [];
  let page = 1;
  let done = false;

  const ui = ora()
    .info('Fetching tweets from https://twitter.com/colorofberlin')
    .start();

  try {
    while (done === false) {
      const tweetsPerPage: Twitter.ResponseData[] = await _fetchTweetsForPage({ page, lastSavedTweet });
  
      if (tweetsPerPage.length > 0) {
        page += 1;
        tweets = tweets.concat(tweetsPerPage);
      } else {
        done = true;
      }
    }

    if (tweets.length > 0 && lastSavedTweet) {
      tweets = tweets.filter((item) => (item.id !== lastSavedTweet.id));
    }

    const tweet = tweets.length === 1 ? 'tweet' : 'tweets';

    ui.succeed(`Fetched ${tweets.length} ${tweet}`);

    return tweets;
  } catch (error) {
    ui.fail(`Fetch from twitter failed: ${error.message}`);

    return[];
  }
};

export { fetchTweets, LastSavedTweet };
