import * as React from 'react';

import apiRoute from './router';
import { Tweets } from '../shared/types/types';
import Month from './month';
import Week from './week';

import './app.less';

interface State {
  tweets: Tweets
}

export default class App extends React.Component<{}, State> {
  state: State = { tweets: [] };

  getRecentTweets = (): void => {
    fetch(apiRoute.getRoute('getRecentTweets'))
      .then(res => res.json())
      .then(res => this.setState({ tweets: res.tweets }));
  };

  getLastWeekTweets = (): void => {
    fetch(apiRoute.getRoute('getLastWeekTweets'))
      .then(res => res.json())
      .then(res => this.setState({ tweets: res.tweets }));
  };

  // Listens for this.state.tweets changes and for each change renders the page
  // to reflect these changes. Here you can specify different page layouts
  // depending on the data format received from the server.
  render(): JSX.Element {
    const tweets = this.state.tweets;

    return (
      <div>
        <p>Length: {this.state.tweets.length}</p>
        <div>
          <button type="button" onClick={this.getRecentTweets}>
            Get Recent Tweets From DB
          </button>
          <button type="button" onClick={this.getLastWeekTweets}>
            Get Last Week Tweets From DB
          </button>
        </div>
        {tweets.length === 28 ? <Month tweets={this.state.tweets} /> : null}
        {tweets.length === 7 ? <Week tweets={this.state.tweets} /> : null}
      </div>
    );
  }
}
