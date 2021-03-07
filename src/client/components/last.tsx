import * as React from 'react';

import { Tweets } from '../../shared/types/types';

interface Proprs {
  tweets: Tweets
}

export default class Last extends React.Component<Proprs, {}> {
  getLine(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    // All days have the same css, therefore we use a loop
    // to create only one div and use it for all tweets.
    // Note that when you use loops React requires unique keys for components to distinguish them.
    for (let item = 0; item < 7; item++) {
      const leftColor = this.props.tweets[offset + item].tweetsByDay[0].colorHex;
      const rightColor = this.props.tweets[offset + item + 1]
        ? this.props.tweets[offset + item + 1].tweetsByDay[0].colorHex // Next tweet color.
        : this.props.tweets[0].tweetsByDay[0].colorHex; // Prev tweet color.

      blocks.push(
        <div
          key={`tweet${offset + item + 1}`}
          className="tweet"
          style={{
            background: `radial-gradient(circle at 100px 100px, ${leftColor}, ${rightColor})`
          }} />
      );
    }

    return (<div key={`line${offset/7+1}`} className="line">{blocks}</div>);
  }

  render(): JSX.Element {
    const rows: JSX.Element[] = [];
    let offset = 0;

    // Use a loop to not repeat the same code for each week of the month.
    for (let line = 0; line < 4; line++) {
      rows.push(this.getLine(offset));
      offset += 7;
    }

    return (<div className="last">{rows}</div>);
  }
}