export const lightenDarkenColor = (col: string, amt: number): string => {
  let usePound = false;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col,16);
  let r = (num >> 16) + amt;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  let g = (num & 0x0000FF) + amt;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};

const _padToTwo = (numberString: string) => {
  if (numberString.length < 2) {
      numberString = '0' + numberString;
  }

  return numberString;
};

export const hexAverage = (dayGradient: string[]): string => {
  const args = dayGradient;

  return args
    .reduce((previousValue: number[], currentValue: string) => {
      const macth = currentValue .replace(/^#/, '').match(/.{2}/g);

      if (macth) {
        return macth?.map((value: string, index: number) => (previousValue[index] + parseInt(value, 16)));
      } else {
        return [0, 0, 0];
      }
    }, [0, 0, 0])
    .reduce((previousValue: string, currentValue: number) => {
      return previousValue + _padToTwo(Math.floor(currentValue / args.length).toString(16));
    }, '#');
};
