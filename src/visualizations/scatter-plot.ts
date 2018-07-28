import { SVGElement } from '../svg-element';

export class ScatterPlot {
  protected margin = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20,
  };

  protected scatterPlotHeight: number = null;

  protected scatterPlotWidth: number = null;

  protected svgElement: SVGElement = null;

  protected xAxis: Array<number> = [];

  protected yAxis: Array<number> = [];

  protected xMinimum: number = null;

  protected xMaximum: number = null;

  protected yMinimum: number = null;

  protected yMaximum: number = null;

  protected xPixelsPerUnit: number = null;

  protected yPixelsPerUnit: number = null;

  constructor(protected height: number, protected width: number) {
    this.scatterPlotHeight = this.height - this.margin.top - this.margin.bottom;

    this.scatterPlotWidth = this.width - this.margin.left - this.margin.right;

    this.xPixelsPerUnit = this.scatterPlotWidth / (this.xMaximum - this.xMinimum);

    this.yPixelsPerUnit = this.scatterPlotHeight / (this.yMaximum - this.yMinimum);
  }

  public setData(xAxis: Array<number>, yAxis: Array<number>): ScatterPlot {
    this.xAxis = xAxis;

    this.yAxis = yAxis;

    this.xMinimum = Math.min(...this.xAxis);
    this.xMaximum = Math.max(...this.xAxis);

    this.yMinimum = Math.min(...this.yAxis);
    this.yMaximum = Math.max(...this.yAxis);

    this.xPixelsPerUnit = this.scatterPlotWidth / (this.xMaximum - this.xMinimum);

    this.yPixelsPerUnit = this.scatterPlotHeight / (this.yMaximum - this.yMinimum);

    return this;
  }

  public setMinimumAndMaximum(xMinimum: number, xMaximum: number, yMinimum: number, yMaximum: number): ScatterPlot {
    this.xMinimum = xMinimum;
    this.xMaximum = xMaximum;

    this.yMinimum = yMinimum;
    this.yMaximum = yMaximum;

    this.xPixelsPerUnit = this.scatterPlotWidth / (this.xMaximum - this.xMinimum);

    this.yPixelsPerUnit = this.scatterPlotHeight / (this.yMaximum - this.yMinimum);

    return this;
  }

  public toString(): string {
    const svgElement: SVGElement = SVGElement.create('svg');

    svgElement.attr('height', this.height);

    svgElement.attr('width', this.width);

    this.drawAxis(svgElement);

    this.drawScatterPlot(svgElement);

    return svgElement.toString();
  }

  protected drawAxis(svgElement: SVGElement): void {
    const legendElement: SVGElement = svgElement
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Draw X-Axis
    legendElement
      .append('line')
      .attr('x1', this.transformX(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('y1', this.transformY(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('x2', this.transformX(this.scatterPlotWidth, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('y2', this.transformY(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('class', 'x-axis');

    // Draw Y-Axis
    legendElement
      .append('line')
      .attr('x1', this.transformX(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('y1', this.transformY(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('x2', this.transformX(0, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('y2', this.transformY(this.scatterPlotHeight, this.scatterPlotHeight, this.scatterPlotWidth))
      .attr('class', 'y-axis');

    // Draw Ticks
    const tickLength: number = 10;
    const numberOfYTicks: number = 10;

    const legendTicksElement: SVGElement = legendElement
      .append('g')
      .attr('id', 'legend-ticks')
      .attr('transform', `translate(${-tickLength}, ${0})`);

    for (let value = this.yMinimum; value <= this.yMaximum; value += (this.yMaximum - this.yMinimum) / numberOfYTicks) {
      legendTicksElement
        .append('line')
        .attr('x1', this.transformX(0, this.scatterPlotHeight, this.scatterPlotWidth))
        .attr(
          'y1',
          this.transformY(
            (Math.ceil(value) - this.yMinimum) * this.yPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr('x2', this.transformX(tickLength, this.scatterPlotHeight, this.scatterPlotWidth))
        .attr(
          'y2',
          this.transformY(
            (Math.ceil(value) - this.yMinimum) * this.yPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr('class', `tick ${value}`);
    }
  }

  protected drawScatterPlot(svgElement: SVGElement): void {
    const scatterPlotElement: SVGElement = svgElement
      .append('g')
      .attr('id', 'scatter-plot')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    for (let index = 0; index < this.xAxis.length; index++) {
      scatterPlotElement
        .append('circle')
        .attr(
          'cx',
          this.transformX(
            (this.xAxis[index] - this.xMinimum) * this.xPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr(
          'cy',
          this.transformY(
            (this.yAxis[index] - this.yMinimum) * this.yPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr('class', 'point');
    }
  }

  protected transformX(x: number, height: number, width: number): number {
    return x;
  }

  protected transformY(y: number, height: number, width: number): number {
    return height - y;
  }
}
