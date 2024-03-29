import * as React from 'react';
import type { Document } from 'mongodb';

interface Props {
  records: Document[];
}

export default class AllData extends React.Component<Props, {}> {
  renderRecordsPerYear(): React.ReactNode {
    return this.props.records.map((item, index) => {
      const dayGradient: string[] = [];

      item.recordsByDay.forEach((item) => {
        dayGradient.push(`#${item.colorHex}`);
      });

      return (
        <div
          className="yearLine"
          key={`yearLine${index}`}
          title={`${item.day}`}
        >
          <div
            className="yearItem"
            style={{
              backgroundImage: `linear-gradient(${dayGradient.join(', ')})`,
            }}
          />
        </div>
      );
    });
  }

  render(): React.ReactNode {
    return <div className="year">{this.renderRecordsPerYear()}</div>;
  }
}
