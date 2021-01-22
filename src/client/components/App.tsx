import * as React from 'react';
import '../less/app.less';
import apiRoute from '../router';

interface AppState {
  text?: string;
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    text: ''
  };

  getText = (): void => {
    fetch(apiRoute.getRoute('test'))
      .then(res => res.json())
      .then(res => this.setState({ text: res.text }));
  };

  render(): JSX.Element {
    const { text } = this.state;

    return (
      <div>
        <p>{!!text && `Hi ${text}!`}</p>
        <div><button type="button" onClick={this.getText}>Say Hi</button></div>
      </div>
    );
  }
}
