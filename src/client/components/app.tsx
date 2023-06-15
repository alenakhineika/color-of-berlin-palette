import * as React from 'react';

import apiRoute from '../router';
import AllData from './allData';
import RecentRecords from './recentRecords';
import RecentRecordsPerWeek from './recentRecordsPerWeek';
import Leaderboard from './leaderboard';
import type { Document } from 'mongodb';

import '../app.less';

interface State {
  records: Document[];
  activeView?: string;
}

enum activeView {
  RECENT_RECORDS = 'getRecentRecords',
  RECENT_RECORDS_PER_WEEK = 'getRecentRecordsPerWeek',
  ALL_DATA = 'getAllData',
  LEADERBOARD = 'getLeaderboard'
}

export default class App extends React.Component<{}, State> {
  state: State = { records: [] };

  getRecords = (view: string, event: MouseEvent): void => {
    event.preventDefault();

    fetch(apiRoute.getRoute(view))
      .then(res => res.json())
      .then(res => this.setState({
        records: res.records,
        activeView: view,
      }));
  };

  renderLayout(): React.ReactNode {
    switch(this.state.activeView) {
      case activeView.RECENT_RECORDS:
        return <RecentRecords records={this.state.records as Document[]} />;
      case activeView.RECENT_RECORDS_PER_WEEK:
        return <RecentRecordsPerWeek records={this.state.records as Document[]} />;
      case activeView.ALL_DATA:
        return <AllData records={this.state.records as Document[]} />;
      case activeView.LEADERBOARD:
        return <Leaderboard records={this.state.records as Document[]} />;
      default:
        return <div />;
    }
  }

  handleChange(view: string, event: MouseEvent): void {
    event.preventDefault();
    this.getRecords(view, event);
  }

  renderButton(view: string, name: string): React.ReactNode {
    const isActiveClass = this.state.activeView === view ? 'active' : '';

    return (
      <label className={`btn btn-outline-secondary btn-sm ${isActiveClass}`}>
        <input
          type="radio"
          name="options"
          id={`button${activeView}`}
          autoComplete="off"
          onChange={this.handleChange.bind(this, view)}
          checked={this.state.activeView === view ? true : false} /> {name}
      </label>
    );
  }

  // Listens for this.state.records changes and for each change renders the page
  // to reflect these changes. Here you can specify different page layouts
  // depending on the data format received from the server.
  render(): React.ReactNode {
    return (
      <div>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {this.renderButton(activeView.RECENT_RECORDS , 'Recent Records')}
          {this.renderButton(activeView.RECENT_RECORDS_PER_WEEK, 'Recent Records Per Week')}
          {this.renderButton(activeView.ALL_DATA, 'Last 365 Days')}
          {
            /* TODO: add a new bubble chart that works with React 18 */
            /* this.renderButton(activeView.LEADERBOARD, 'Leaderboard') */
          }
        </div>
        {this.renderLayout()}
      </div>
    );
  }
}
