import dotenv from 'dotenv';
import ora from 'ora';
import Twitter from 'twitter';
import util from 'util';

import { LastSavedTweet, TwitterParams, GetTweets } from '../src/shared/types/types';

const envConstants = process.env.NODE_ENV !== 'production'
  ? dotenv.config().parsed
  : process.env;
const twitterOptions: Twitter.BearerTokenOptions = {
  consumer_key: envConstants?.TWITTER_API_CONSUMER_KEY || '',
  consumer_secret: envConstants?.TWITTER_API_CONSUMER_SECRET || '',
  bearer_token: envConstants?.TWITTER_BEARER_TOKEN || '',
};

const client: Twitter = new Twitter(twitterOptions);

const fetchTweets = async (lastSavedTweet?: LastSavedTweet): Promise<Twitter.ResponseData[]> => {
  let tweets: Twitter.ResponseData[] = [];
  let done = false;

  const ui = ora()
    .info('Fetching tweets from https://twitter.com/colorofberlin')
    .start();

  try {
    const getTweets: GetTweets = util.promisify(client.get.bind(client));
    const twitterParameters: TwitterParams = {
      screen_name: 'colorofberlin',
      count: 200
    };

    if (lastSavedTweet) {
      // If there are some tweets already saved to mongodb, combine since_id and max_id
      // parameters to fetch tweets starting from the most recent one.
      // The first request to a timeline endpoint should only specify a count.
      // When processing responses, keep track of the lowest id received,
      // this id should be passed as the value of the max_id parameter for the next request.
      // We stop fetching when since_id is equal to the biggest twitter id in the database.
      twitterParameters.since_id = lastSavedTweet.id.toString();
    } else {
      tweets = await getTweets('statuses/user_timeline', twitterParameters);
      twitterParameters.max_id = (tweets.pop() || {}).id;
    }

    while (done === false) {
      const nextTweets = await getTweets('statuses/user_timeline', twitterParameters);

      if (nextTweets.length === 200) {
        twitterParameters.max_id = (nextTweets.pop() || {}).id;
      } else {
        done = true;
      }

      tweets = tweets.concat(nextTweets);
    }

    const tweet = tweets.length === 1 ? 'tweet' : 'tweets';

    ui.succeed(`Fetched ${tweets.length} ${tweet}`);

    return tweets;
  } catch (error) {
    ui.fail(`Fetch from twitter failed: ${error.message}`);

    return [];
  }
};

export { fetchTweets, LastSavedTweet };
