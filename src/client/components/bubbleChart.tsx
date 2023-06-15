import React from 'react';
import * as d3 from 'd3';

interface Props {
  width?: number;
  height?: number;
  overflow?: string;
  graph?: {
    zoom: number;
    offsetX: number;
    offsetY: number;
  };
  data?: { label: string; value: number }[];
  padding?: number;
  showLegend?: boolean;
  legendPercentage?: number;
  bubbleClickFun?: (label: string) => void;
  legendClickFun?: (label: string) => void;
  valueFont?: {
    family?: string;
    size?: number;
    color?: string;
    weight?: string;
    lineColor?: string;
    lineWeight?: string;
  };
  labelFont?: {
    family?: string;
    size?: number;
    color?: string;
    weight?: string;
    lineColor?: string;
    lineWeight?: string;
  };
  legendFont?: {
    family?: string;
    size?: number;
    color?: string;
    weight?: string;
    lineColor?: string;
    lineWeight?: string;
  };
}

export default class BubbleChart extends React.Component<Props, {}> {
  private svg;

  // Set default props.
  static defaultProps = {
    overflow: false,
    graph: {
      zoom: 1.1,
      offsetX: -0.05,
      offsetY: -0.01,
    },
    width: 1000,
    height: 800,
    padding: 0,
    showLegend: true,
    legendPercentage: 20,
    legendFont: {
      family: 'Arial',
      size: 12,
      color: '#000',
      weight: 'bold',
    },
    valueFont: {
      family: 'Arial',
      size: 16,
      color: '#fff',
      weight: 'bold',
    },
    labelFont: {
      family: 'Arial',
      size: 11,
      color: '#fff',
      weight: 'normal',
    },
  };

  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);
    this.renderBubbles = this.renderBubbles.bind(this);
    this.renderLegend = this.renderLegend.bind(this);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    const { width, height } = this.props;

    if (width !== 0 && height !== 0) {
      this.renderChart();
    }
  }

  render() {
    const { width, height, overflow } = this.props;
    return (
      <svg
        width={width}
        height={height}
        ref={(svg) => {
          this.svg = svg;
        }}
        style={overflow ? { overflow: 'visible' } : {}}
      />
    );
  }

  renderChart() {
    const {
      graph,
      data,
      height,
      width,
      padding,
      showLegend,
      legendPercentage,
    } = this.props;
    const bubblesWidth = showLegend
      ? width * (1 - legendPercentage / 100)
      : width;
    const legendWidth = width - bubblesWidth;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pack = d3
      .pack()
      .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
      .padding(padding);

    // Process the data to have a hierarchy structure.
    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
      .each((d) => {
        if (d.data.label) {
          d.label = d.data.label;
          d.id = d.data.label.toLowerCase().replace(/ |\//g, '-');
        }
      });

    // Pass the data to the pack layout to calculate the distribution.
    const nodes = pack(root).leaves();

    // Call to the function that draw the bubbles.
    this.renderBubbles(bubblesWidth, nodes, color);
    // Call to the function that draw the legend.
    if (showLegend) {
      this.renderLegend(legendWidth, height, bubblesWidth, nodes, color);
    }
  }

  renderBubbles(width, nodes, color) {
    const { graph, bubbleClickFun, valueFont, labelFont } = this.props;

    const bubbleChart = d3
      .select(this.svg)
      .append('g')
      .attr('class', 'bubble-chart')
      .attr(
        'transform',
        () => `translate(${width * graph.offsetX},${width * graph.offsetY})`,
      );

    const node = bubbleChart
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (d) => {
        if (!bubbleClickFun) return;
        bubbleClickFun(d.label);
      });

    node
      .append('circle')
      .attr('id', (d) => d.id)
      .attr('r', (d) => d.r - d.r * 0.04)
      .style('fill', (d) =>
        d.data.color ? d.data.color : color(nodes.indexOf(d)),
      )
      .style('z-index', 1)
      .on('mouseover', function (d) {
        d3.select(`#${d.id}`).attr('r', d.r * 1.04);
      })
      .on('mouseout', function (d) {
        const r = d.r - d.r * 0.04;
        d3.select(`#${d.id}`).attr('r', r);
      });

    node
      .append('clipPath')
      .attr('id', (d) => `clip-${d.id}`)
      .append('use')
      .attr('xlink:href', (d) => `#${d.id}`);

    node
      .append('text')
      .attr('class', 'value-text')
      .style('font-size', `${valueFont.size}px`)
      .attr('clip-path', (d) => `url(#clip-${d.id})`)
      .style('font-weight', () => (valueFont.weight ? valueFont.weight : 600))
      .style('font-family', valueFont.family)
      .style('fill', () => (valueFont.color ? valueFont.color : '#000'))
      .style('stroke', () =>
        valueFont.lineColor ? valueFont.lineColor : '#000',
      )
      .style('stroke-width', () =>
        valueFont.lineWeight ? valueFont.lineWeight : 0,
      )
      .text((d) => d.value);

    node
      .append('text')
      .attr('class', 'label-text')
      .style('font-size', `${labelFont.size}px`)
      .attr('clip-path', (d) => `url(#clip-${d.id})`)
      .style('font-weight', () => (labelFont.weight ? labelFont.weight : 600))
      .style('font-family', labelFont.family)
      .style('fill', () => (labelFont.color ? labelFont.color : '#000'))
      .style('stroke', () =>
        labelFont.lineColor ? labelFont.lineColor : '#000',
      )
      .style('stroke-width', () =>
        labelFont.lineWeight ? labelFont.lineWeight : 0,
      )
      .text((d) => d.label);

    // Center the texts inside the circles.
    d3.selectAll('.label-text')
      .attr('x', function () {
        const self = d3.select(this);
        const width = self.node()?.getBBox().width;
        return -(width / 2);
      })
      .style('opacity', function (d) {
        const self = d3.select(this);
        const width = self.node()?.getBBox().width;
        d.hideLabel = width * 1.05 > d.r * 2;
        return d.hideLabel ? 0 : 1;
      })
      .attr('y', () => labelFont.size / 2);

    // Center the texts inside the circles.
    d3.selectAll('.value-text')
      .attr('x', function () {
        const self = d3.select(this);
        const width = self.node()?.getBBox().width;
        return -(width / 2);
      })
      .attr('y', (d) => {
        if (d.hideLabel) {
          return valueFont.size / 3;
        } else {
          return -valueFont.size * 0.5;
        }
      });

    node.append('title').text((d) => d.label);
  }

  renderLegend(width, height, offset, nodes, color) {
    const { legendClickFun, legendFont } = this.props;
    const bubble = d3.select('.bubble-chart');
    const bubbleHeight = bubble.node()?.getBBox().height;

    const legend = d3
      .select(this.svg)
      .append('g')
      .attr('transform', () => `translate(${offset},${bubbleHeight * 0.05})`)
      .attr('class', 'legend');

    let textOffset = 0;
    const texts = legend
      .selectAll('.legend-text')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', () => {
        const offset = textOffset;
        textOffset += legendFont.size + 10;
        return `translate(0,${offset})`;
      })
      .on('mouseover', (d) => {
        d3.select(`#${d.id}`).attr('r', d.r * 1.04);
      })
      .on('mouseout', (d) => {
        const r = d.r - d.r * 0.04;
        d3.select(`#${d.id}`).attr('r', r);
      })
      .on('click', (d) => {
        if (!legendClickFun) return;
        legendClickFun(d.label);
      });

    texts
      .append('rect')
      .attr('width', 30)
      .attr('height', legendFont.size)
      .attr('x', 0)
      .attr('y', -legendFont.size)
      .style('fill', 'transparent');

    texts
      .append('rect')
      .attr('width', legendFont.size)
      .attr('height', legendFont.size)
      .attr('x', 0)
      .attr('y', -legendFont.size)
      .style('fill', (d) =>
        d.data.color ? d.data.color : color(nodes.indexOf(d)),
      );

    texts
      .append('text')
      .style('font-size', `${legendFont.size}px`)
      .style('font-weight', () => (legendFont.weight ? legendFont.weight : 600))
      .style('font-family', legendFont.family)
      .style('fill', () => (legendFont.color ? legendFont.color : '#000'))
      .style('stroke', () =>
        legendFont.lineColor ? legendFont.lineColor : '#000',
      )
      .style('stroke-width', () =>
        legendFont.lineWeight ? legendFont.lineWeight : 0,
      )
      .attr('x', () => legendFont.size + 10)
      .attr('y', 0)
      .text((d) => d.label);
  }
}
