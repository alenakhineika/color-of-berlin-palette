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

  getText = (): void => {
    fetch(apiRoute.getRoute('getTweets'))
      .then(res => res.json())
      .then(res => this.setState({ tweets: res.tweets }));
  };

  getWeekOfMonth(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    for (let day = 0; day < 6; day++) {
      blocks.push(<div className="day" style={{background: this.state.tweets[offset + day].colorHex}}></div>);
    }

    return (<div className="week">{blocks}</div>);
  }

  getMonthPalette(): JSX.Element {
    const rows: any[] = [];
    let offset = 0;

    for (let week = 0; week < 5; week++) {
      rows.push(this.getWeekOfMonth(offset));
      offset += 6;
    }

    return (<div className="month">{rows}</div>);
  }

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
