import * as React from 'react';
import BubbleChart from '@weknow/react-bubble-chart-d3';

import { Tweets } from '../../shared/types/types';

interface Proprs {
  tweets: Tweets
}

export default class Week extends React.Component<Proprs, {}> {
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
          showLegend={false}
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
