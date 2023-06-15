import * as React from 'react';

import { hexAverage, lightenDarkenColor } from '../utils';
import type { Document } from 'mongodb';

interface Proprs {
  records: Document[];
}

export default class RecentRecordsPerWeek extends React.Component<Proprs, {}> {
  render(): React.ReactNode {
    const weekByDays: JSX.Element[] = [];
    const weekDominantColors: JSX.Element[] = [];

    for (let day = 0; day < 7; day++) {
      const dayGradient: string[] = [];

      this.props.records[day].recordsByDay.forEach((item, index) => {
        dayGradient.push(`#${this.props.records[day].recordsByDay[index].colorHex}`);
      });

      weekByDays.push(
        <div
          key={`dayOfWeek${day}`}
          className="dayOfWeek"
          style={{
            backgroundImage: `linear-gradient(${dayGradient.join(', ')})`
          }} />
      );

      const averageDayGradient = hexAverage(dayGradient);
      const darkerDayGradient = lightenDarkenColor(averageDayGradient, 80);

      weekDominantColors.push(
        <div
          key={`hourOfDay${day}`}
          className="hourOfDay"
          style={{
            background: `radial-gradient(circle at 100px 100px, ${averageDayGradient}, ${darkerDayGradient})`
          }} />
      );
    }

    return (
      <div className="week">
        <div className="weekByDays">{weekByDays}</div>
        <div className="weekDominantColors">{weekDominantColors}</div>
      </div>
    );
  }
}