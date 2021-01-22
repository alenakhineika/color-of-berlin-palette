import dotenv from 'dotenv';
import ora from 'ora';
import Twitter from 'twitter';
import util from 'util';

const envConstants = process.env.NODE_ENV !== 'production'
  ? dotenv.config().parsed
  : process.env;
const twitterOptions: Twitter.BearerTokenOptions = {
  consumer_key: envConstants?.TWITTER_API_CONSUMER_KEY || '',
  consumer_secret: envConstants?.TWITTER_API_CONSUMER_SECRET || '',
  bearer_token: envConstants?.TWITTER_BEARER_TOKEN || '',
};

type GetTweets = (
  arg1: string,
  arg2: { screen_name: string; count: number; page: number },
) => Promise<any>;

const client: Twitter = new Twitter(twitterOptions);

const _fetchTweetsForPage = (
  page: number,
): Promise<Twitter.ResponseData[]> => {
  const getTweets: GetTweets = util.promisify(client.get.bind(client));

  return getTweets('statuses/user_timeline', {
    screen_name: 'colorofberlin',
    count: 200,
    page,
  });
};

const fetchTweets = async (): Promise<Twitter.ResponseData[]> => {
  let tweets: Twitter.ResponseData[] = [];
  let page = 1;
  let done = false;

  const ui = ora()
    .info('Fetching tweets from https://twitter.com/colorofberlin')
    .start();

  try {
    while (done === false) {
      const tweetsPerPage: Twitter.ResponseData[] = await _fetchTweetsForPage(page);
  
      if (tweetsPerPage.length > 0) {
        page += 1;
        tweets = tweets.concat(tweetsPerPage);
      } else {
        done = true;
      }
    }

    ui.succeed(`Fetched ${tweets.length} tweets`);

    return tweets;
  } catch (error) {
    ui.fail(`Fetch from twitter failed: ${error.message}`);

    return[];
  }
};

export default fetchTweets;
