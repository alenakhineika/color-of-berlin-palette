import { EJSON } from 'bson';
import * as fse from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

const writeToFile = async (data: EJSON.SerializableTypes[]): Promise<void> => {
  const [date, month, year] = new Date().toLocaleDateString('en-US').split('/');
  const distPath: string = path.join(
    __dirname,
    '../../out',
    `colorofberlin-tweets-${date}-${month}-${year}-${data.length}.json`,
  );

  try {
    await fse.ensureFile(distPath);
    await fse.writeJson(distPath, data, {
      spaces: 2,
      EOL: os.EOL,
    });
    console.log(`Tweets saved to '${distPath}'`);
  } catch (error) {
    console.error(`Write json to file failed: ${error.message}`);
  }
};

export default writeToFile;
