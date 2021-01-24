import * as React from 'react';
import '../less/app.less';
import apiRoute from '../router';

interface AppState {
  tweets: {
    id: number,
    created_at: string,
    text: string,
    colorHex: string,
    colorName: string
  }[] | []
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = { tweets: [] };

  // When a user clicks the `Get Tweets` button
  // Send a request to server/index.ts and wait for results.
  // After receiving results update the React state
  // To fire page rendering.
  getText = (): void => {
    fetch(apiRoute.getRoute('getTweets'))
      .then(res => res.json())
      .then(res => this.setState({ tweets: res.tweets }));
  };

  getWeekOfMonth(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    // All days have the same css, therefore we use a loop
    // to create only one div and use it for all days.
    for (let day = 0; day < 6; day++) {
      blocks.push(<div className="day" style={{background: this.state.tweets[offset + day].colorHex}}></div>);
    }

    return (<div className="week">{blocks}</div>);
  }

  // Returns layout for a month.
  getMonthPalette(): JSX.Element {
    const rows: JSX.Element[] = [];
    let offset = 0;

    // One month contains 4 weeks, therefore we use a loop to not repeat the same code for each week.
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
  // It renders the layout with 30 squares filled with a color.
  render(): JSX.Element {
    const tweets = this.state.tweets;

    return (
      <div>
        <p>Length: {this.state.tweets.length}</p>
        <div><button type="button" onClick={this.getText}>Get Tweets</button></div>
        {tweets.length === 30 ? this.getMonthPalette() : null}
      </div>
    );
  }
}
