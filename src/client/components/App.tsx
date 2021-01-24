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

  render(): JSX.Element {
    const length = this.state.tweets.length;

    return (
      <div>
        <p>Length: {length}</p>
        <div><button type="button" onClick={this.getText}>Get Tweets</button></div>
      </div>
    );
  }
}
