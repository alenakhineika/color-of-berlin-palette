import * as React from 'react';

import apiRoute from '../router';
import { Tweets, Tweet, TweetsByDay, TweetsLeaderboard } from '../../shared/types/types';
import AllData from './allData';
import RecentTweets from './recentTweets';
import RecentTweetsPerWeek from './recentTweetsPerWeek';
import Leaderboard from './leaderboard';

import '../app.less';

interface State {
  tweets: Tweets;
  activeView?: string;
}

enum activeView {
  RECENT_TWEETS = 'getRecentTweets',
  RECENT_TWEETS_PER_WEEK = 'getRecentTweetsPerWeek',
  ALL_DATA = 'getAllData',
  LEADERBOARD = 'getLeaderboard'
}

export default class App extends React.Component<{}, State> {
  state: State = { tweets: [] };

  getTweets = (activeView: string, event: MouseEvent): void => {
    event.preventDefault();

    fetch(apiRoute.getRoute(activeView))
      .then(res => res.json())
      .then(res => this.setState({
        tweets: res.tweets,
        activeView
      }));
  };

  renderLayout(): React.ReactNode {
    switch(this.state.activeView) {
      case activeView.RECENT_TWEETS:
        return <RecentTweets tweets={this.state.tweets as Tweet[]} />;
      case activeView.RECENT_TWEETS_PER_WEEK:
        return <RecentTweetsPerWeek tweets={this.state.tweets as TweetsByDay[]} />;
      case activeView.ALL_DATA:
        return <AllData tweets={this.state.tweets as TweetsByDay[]} />;
      case activeView.LEADERBOARD:
        return <Leaderboard tweets={this.state.tweets as TweetsLeaderboard[]} />;
      default:
        return <div />;
    }
  }

  renderButton(activeView: string, name: string): React.ReactNode {
    const isActiveClass = this.state.activeView === activeView ? 'active' : '';

    return (
      <label className={`btn btn-outline-secondary btn-sm ${isActiveClass}`}>
        <input
          type="radio"
          name="options"
          id={`button${activeView}`}
          autoComplete="off"
          onClick={this.getTweets.bind(this, activeView)}
          checked={this.state.activeView === activeView ? true : false} /> {name}
      </label>
    );
  }

  // Listens for this.state.tweets changes and for each change renders the page
  // to reflect these changes. Here you can specify different page layouts
  // depending on the data format received from the server.
  render(): React.ReactNode {
    return (
      <div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {this.renderButton(activeView.RECENT_TWEETS , 'Recent Tweets')}
          {this.renderButton(activeView.RECENT_TWEETS_PER_WEEK, 'Recent Tweets Per Week')}
          {this.renderButton(activeView.ALL_DATA, 'All Data')}
          {this.renderButton(activeView.LEADERBOARD, 'Leaderboard')}
        </div>
        {this.renderLayout()}
      </div>
    );
  }
}
