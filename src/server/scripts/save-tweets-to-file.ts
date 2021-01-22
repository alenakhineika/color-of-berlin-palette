
import Twitter from 'twitter';
import fetchTweets from '../utils/twitter';
import writeToFile from '../utils/filesystem';

(async () => {
  const data: Twitter.ResponseData[] = await fetchTweets();
    
  if (data.length > 0) {
    await writeToFile(data);
  }
})();
