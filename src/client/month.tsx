import * as React from 'react';

import { Tweets } from '../shared/types/types';

interface Proprs {
  tweets: Tweets
}

export default class Month extends React.Component<Proprs, {}> {
  getWeekOfMonth(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    // All days have the same css, therefore we use a loop
    // to create only one div and use it for all days.
    // Note that when you use loops React requires unique keys for components to distinguish them.
    for (let day = 0; day < 7; day++) {
      const leftColor = this.props.tweets[offset + day].tweetsByDay[0].colorHex;
      const rightColor = this.props.tweets[offset + day + 1]
        ? this.props.tweets[offset + day + 1].tweetsByDay[0].colorHex // Next day color.
        : this.props.tweets[0].tweetsByDay[0].colorHex; // Prev day color.

      blocks.push(
        <div
          key={`dayOfMonth${offset + day + 1}`}
          className="dayOfMonth"
          style={{
            background: `radial-gradient(circle at 100px 100px, ${leftColor}, ${rightColor})`
          }} />
      );
    }

    return (<div key={`weekOfMonth${offset/7+1}`} className="weekOfMonth">{blocks}</div>);
  }

  render(): JSX.Element {
    const rows: JSX.Element[] = [];
    let offset = 0;

    // Use a loop to not repeat the same code for each week of the month.
    for (let week = 0; week < 4; week++) {
      rows.push(this.getWeekOfMonth(offset));
      offset += 7;
    }

    return (<div className="month">{rows}</div>);
  }
}