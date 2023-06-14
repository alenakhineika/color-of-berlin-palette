import * as React from 'react';

import { RecordsByDay } from '../../shared/types/types';

interface Proprs {
  records: RecordsByDay[];
}

export default class AllData extends React.Component<Proprs, {}> {
  renderRecordsPerYear(): React.ReactNode {
    return this.props.records.map((item, index) => {
      const dayGradient: string[] = [];

      item.recordsByDay.forEach((item) => {
        dayGradient.push(`#${item.colorHex}`);
      });

      return (
        <div className="yearLine" key={`yearLine${index}`} title={`${item.day}`}>
          <div className="yearItem" style={{
            backgroundImage: `linear-gradient(${dayGradient.join(', ')})`
          }} />
        </div>
      );
    });
  }

  render(): React.ReactNode {
    return (<div className="year">{this.renderRecordsPerYear()}</div>);
  }
}
