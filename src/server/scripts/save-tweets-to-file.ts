
import Twitter from 'twitter';
import { fetchTweets } from '../utils/twitter';
import writeToFile from '../utils/filesystem';

(async () => {
  console.log('Fetch all tweets');
  
  const data: Twitter.ResponseData[] = await fetchTweets();
    
  if (data.length > 0) {
    await writeToFile(data);
  }
})();
