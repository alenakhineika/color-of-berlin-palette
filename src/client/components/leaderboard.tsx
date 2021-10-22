import * as React from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';

import { TweetsLeaderboard } from '../../shared/types/types';

interface Proprs {
  tweets: TweetsLeaderboard[];
}

export default class Leaderboard extends React.Component<Proprs, {}> {
  render(): React.ReactNode {
    return (
    <div className="bubble">
      <div className="chart">
        <BubbleChart
          graph={{
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
          }}
          legendFont={{
            family: 'Arial',
            size: 11,
            color: '#6c757d'
          }}
          labelFont={{
            size: 0
          }}
          valueFont={{
            size: 0
          }}
          showLegend={true}
          width={600}
          height={600}
          padding={15}
          data={this.props.tweets}
        />
      </div>
    </div>
    );
  }
}
