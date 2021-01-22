import Twitter from 'twitter';

import fetchTweets from '../utils/twitter';
import writeToFile from '../utils/filesystem';

(async () => {
  try {
    const data: Twitter.ResponseData[] = await fetchTweets();

    await writeToFile(data);

    console.log('Save tweets to file', data);
  } catch (error) {
    console.error('Save tweets to file error', error);
  }
})();
