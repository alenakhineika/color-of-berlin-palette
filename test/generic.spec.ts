import { getColorsFromText } from '../src/server/controllers/generic';
import { expect } from 'chai';

import * as util from 'util';

describe('Generic Controller', () => {
  it('get colors from text', () => {
    const tweets = [
      {
        tweetsByDay: [
          {
            id: 1369179204189819000,
            text: 'The color of the sky in Berlin is slate gray. #7a788e https://t.co/rYTIRVnXRY'
          }
        ],
        day: '2021-03-09T00:00:00.000Z'
      }
    ];
    const parsedTweets = [
      {
        tweetsByDay: [
          {
            id: 1369179204189819000,
            created_at: undefined,
            text: 'The color of the sky in Berlin is slate gray. #7a788e https://t.co/rYTIRVnXRY',
            colorHex: '#7a788e',
            colorName: 'slate gray'
          }
        ],
        day: '2021-03-09T00:00:00.000Z'
      }
    ];

    expect(getColorsFromText(tweets)).to.deep.equal(parsedTweets);
  });
});
