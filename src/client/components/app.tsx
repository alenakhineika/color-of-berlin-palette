import * as React from 'react';

import apiRoute from '../router';
import { Tweets } from '../../shared/types/types';
import Month from './month';
import Week from './week';

import '../app.less';

interface State {
  tweets: Tweets,
  activeView?: string,
}

enum activeView {
  GET_RECENT_TWEETS = 'getRecentTweets',
  GET_LAST_WEEK_TWEETS = 'getLastWeekTweets'
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

  renderLayout(): JSX.Element {
    switch(this.state.tweets.length) {
      case 28:
        return <Month tweets={this.state.tweets} />;
      case 7:
        return <Week tweets={this.state.tweets} />;
      default:
        return <div />;
    }
  }

  renderButton(activeView: string, name: string): JSX.Element {
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
  render(): JSX.Element {
    return (
      <div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {this.renderButton(activeView.GET_RECENT_TWEETS, 'Get Recent Tweets From DB')}
          {this.renderButton(activeView.GET_LAST_WEEK_TWEETS, 'Get Last Week Tweets From DB')}
        </div>
        {this.renderLayout()}
      </div>
    );
  }
}
