import * as React from 'react';

import { hexAverage, lightenDarkenColor } from '../utils';
import { TweetsByDay } from '../../shared/types/types';

interface Proprs {
  tweets: TweetsByDay[];
}

export default class RecentTweetsPerWeek extends React.Component<Proprs, {}> {
  render(): React.ReactNode {
    const weekByDays: JSX.Element[] = [];
    const weekDominantColors: JSX.Element[] = [];

    for (let day = 0; day < 7; day++) {
      const dayGradient: string[] = [];

      this.props.tweets[day].tweetsByDay.forEach((item, index) => {
        dayGradient.push(`#${this.props.tweets[day].tweetsByDay[index].colorHex}`);
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