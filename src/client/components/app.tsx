import * as React from 'react';

import apiRoute from '../router';
import { Tweets } from '../../shared/types/types';
import All from './all';
import Last from './last';
import Week from './week';
import Bubble from './bubble';

import '../app.less';

interface State {
  tweets: Tweets,
  activeView?: string,
}

enum activeView {
  GET_THIRTY_TWEETS_COLORS = 'getThirtyTweetsColors',
  GET_SEVEN_DAYS_COLORS = 'getSevenDaysColors',
  GET_ALL_COLORS = 'getAllColors',
  GET_CURRENT_SCORE = 'getCurrentScore'
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
      case activeView.GET_THIRTY_TWEETS_COLORS:
        return <Last tweets={this.state.tweets} />;
      case activeView.GET_SEVEN_DAYS_COLORS:
        return <Week tweets={this.state.tweets} />;
      case activeView.GET_ALL_COLORS:
        return <All tweets={this.state.tweets} />;
      case activeView.GET_CURRENT_SCORE:
        return <Bubble tweets={this.state.tweets} />;
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
          {this.renderButton(activeView.GET_THIRTY_TWEETS_COLORS, 'Get last 28 tweets')}
          {this.renderButton(activeView.GET_SEVEN_DAYS_COLORS, 'Get last 7 days tweets')}
          {this.renderButton(activeView.GET_ALL_COLORS, 'Get all tweets')}
          {this.renderButton(activeView.GET_CURRENT_SCORE, 'Get current score')}
        </div>
        {this.renderLayout()}
      </div>
    );
  }
}
