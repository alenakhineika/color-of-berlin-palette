import * as React from 'react';

import { Tweets, TweetsByDay } from '../../shared/types/types';

interface Proprs {
  tweets: Tweets
}

export default class All extends React.Component<Proprs, {}> {
  rendertweetsPerDay(day: TweetsByDay): React.ReactNode {
    return day.tweetsByDay.map((item, index) => {
      return (
        <div className="yearItem" key={`yearItem${index}`} style={{
          background: `${item.colorHex ? `#${item.colorHex}`: ''}`
        }}></div>
      );
    });
  }

  rendertweetsPerYear(): React.ReactNode {
    return this.props.tweets.map((day, index) => {
      return (<div className="yearLine" key={`yearLine${index}`}>
        {this.rendertweetsPerDay(day)}
      </div>);
    });
  }

  render(): React.ReactNode {
    return (<div className="year">{this.rendertweetsPerYear()}</div>);
  }
}