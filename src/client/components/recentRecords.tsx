import * as React from 'react';

import { Record } from '../../shared/types/types';

interface Proprs {
  records: Record[];
}

export default class RecentRecords extends React.Component<Proprs, {}> {
  getLine(offset: number): JSX.Element {
    const blocks: JSX.Element[] = [];

    // All days have the same css, therefore we use a loop
    // to create only one div and use it for all records.
    // Note that when you use loops React requires unique keys for components to distinguish them.
    for (let item = 0; item < 7; item++) {
      const currentColor = `#${this.props.records[offset + item].colorHex}`;
      const nextColor = this.props.records[offset + item + 1]
        ? `#${this.props.records[offset + item + 1].colorHex}` // Next record color.
        : `#${this.props.records[0].colorHex}`; // Prev record color.

      blocks.push(
        <div
          title={`${this.props.records[offset + item].created_at}`}
          key={`record${offset + item + 1}`}
          className="record"
          style={{
            background: `radial-gradient(circle at 100px 100px, ${currentColor}, ${nextColor})`
          }} />
      );
    }

    return (<div key={`line${offset/7+1}`} className="line">{blocks}</div>);
  }

  render(): React.ReactNode {
    const rows: JSX.Element[] = [];
    let offset = 0;

    // Use a loop to not repeat the same code for each week of the month.
    for (let line = 0; line < 4; line++) {
      rows.push(this.getLine(offset));
      offset += 7;
    }

    return (<div className="last">{rows}</div>);
  }
}