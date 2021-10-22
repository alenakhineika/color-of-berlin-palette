import * as React from 'react';

import { TweetsByDay } from '../../shared/types/types';

interface Proprs {
  tweets: TweetsByDay[];
}

export default class AllData extends React.Component<Proprs, {}> {
  rendertweetsPerYear(): React.ReactNode {
    return this.props.tweets.map((item, index) => {
      const dayGradient: string[] = [];

      item.tweetsByDay.forEach((item) => {
        dayGradient.push(`#${item.colorHex}`);
      });

      return (
        <div className="yearLine" key={`yearLine${index}`} title={`${item.day}`}>
          <div className="yearItem" style={{
            backgroundImage: `linear-gradient(${dayGradient.join(', ')})`
          }} />
        </div>
      );
    });
  }

  render(): React.ReactNode {
    return (<div className="year">{this.rendertweetsPerYear()}</div>);
  }
}