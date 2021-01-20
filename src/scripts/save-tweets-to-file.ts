import Twitter from 'twitter';

import { fetchTweets } from '../twitter';
import { writeToFile } from '../filesystem';

(async () => {
  try {
    const data: Twitter.ResponseData[] = await fetchTweets(100);

    await writeToFile(data);

    console.log('Save tweets to file', data);
  } catch (error) {
    console.error('Save tweets to file error', error);
  }
})();
