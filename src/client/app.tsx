import * as React from 'react';
import apiRoute from './router';

import './app.less';

interface State {
  tweets: {
    id: number,
    created_at: string,
    text: string,
    colorHex: string,
    colorName: string
  }[] | []
}

export default class App extends React.Component<{}, State> {
  state: State = { tweets: [] };

  // When a user clicks the `Get Thirty Recent Tweets From DB` button,
  // send a request to the server and wait for results.
  // After receiving results update the React state to fire page rendering.
  getThirtyRecentTweets = (): void => {
    fetch(apiRoute.getRoute('getTweets'))
      .then(res => res.json())
      .then(res => this.setState({ tweets: res.tweets }));
  };

  getWeekOfMonth(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    // All days have the same css, therefore we use a loop
    // to create only one div and use it for all days.
    // Note that when you use loops React requires unique keys for components to distinguish them.
    for (let day = 0; day < 6; day++) {
      blocks.push(
        <div key={`day${day+1}`} className="day" style={{background: this.state.tweets[offset + day].colorHex}}></div>
      );
    }

    return (<div key={`week${offset/7+1}`} className="week">{blocks}</div>);
  }

  // Returns layout for a month.
  getMonthPalette(): JSX.Element {
    const rows: JSX.Element[] = [];
    let offset = 0;

    // Use a loop to not repeat the same code for each week of the month.
    for (let week = 0; week < 4; week++) {
      rows.push(this.getWeekOfMonth(offset));
      offset += 7;
    }

    return (<div className="month">{rows}</div>);
  }

  // Listens for this.state.tweets changes and for each change renders the page
  // to reflect these changes. Here you can specify different page layouts
  // depending on the data format received from the server.
  // Currently it checks if the server returns 30 tweets
  // it renders the layout with 30 squares filled with a color.
  render(): JSX.Element {
    const tweets = this.state.tweets;

    return (
      <div>
        <p>Length: {this.state.tweets.length}</p>
        <div><button type="button" onClick={this.getThirtyRecentTweets}>Get Thirty Recent Tweets From DB</button></div>
        {tweets.length === 30 ? this.getMonthPalette() : null}
      </div>
    );
  }
}
