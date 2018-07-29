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

  protected xAxes: Array<Array<number>> = [];

  protected yAxes: Array<Array<number>> = [];

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

  public setData(xAxes: Array<Array<number>>, yAxes: Array<Array<number>>): ScatterPlot {
    this.xAxes = xAxes;

    this.yAxes = yAxes;

    this.xMinimum = Math.min(...this.xAxes.map((xAxis: Array<number>) => Math.min(...xAxis)));
    this.xMaximum = Math.max(...this.xAxes.map((xAxis: Array<number>) => Math.max(...xAxis)));

    this.yMinimum = Math.min(...this.yAxes.map((yAxis: Array<number>) => Math.min(...yAxis)));
    this.yMaximum = Math.max(...this.yAxes.map((yAxis: Array<number>) => Math.max(...yAxis)));

    this.xPixelsPerUnit = this.scatterPlotWidth / (this.xMaximum - this.xMinimum);

    this.yPixelsPerUnit = this.scatterPlotHeight / (this.yMaximum - this.yMinimum);

    return this;
  }

  public setMinimumAndMaximum(xMinimum: number, xMaximum: number, yMinimum: number, yMaximum: number): ScatterPlot {
    this.xMinimum = xMinimum !== null ? xMinimum : this.xMinimum;
    this.xMaximum = xMaximum !== null ? xMaximum : this.xMaximum;

    this.yMinimum = yMinimum !== null ? yMinimum : this.yMinimum;
    this.yMaximum = yMaximum !== null ? yMaximum : this.yMaximum;

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

    const numberOfXTicks: number = 10;
    const numberOfYTicks: number = 10;

    const legendXTicksElement: SVGElement = legendElement
      .append('g')
      .attr('id', 'legend-x-ticks')
      .attr('transform', `translate(${0}, ${tickLength})`);

    const legendYTicksElement: SVGElement = legendElement
      .append('g')
      .attr('id', 'legend-y-ticks')
      .attr('transform', `translate(${-tickLength}, ${0})`);

    for (let value = this.xMinimum; value <= this.xMaximum; value += (this.xMaximum - this.xMinimum) / numberOfXTicks) {
      legendXTicksElement
        .append('line')
        .attr(
          'x1',
          this.transformX(
            (Math.ceil(value) - this.xMinimum) * this.xPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr('y1', this.transformY(0, this.scatterPlotHeight, this.scatterPlotWidth))
        .attr(
          'x2',
          this.transformX(
            (Math.ceil(value) - this.xMinimum) * this.xPixelsPerUnit,
            this.scatterPlotHeight,
            this.scatterPlotWidth,
          ),
        )
        .attr('y2', this.transformY(10, this.scatterPlotHeight, this.scatterPlotWidth))
        .attr('class', `tick ${value}`);
    }

    for (let value = this.yMinimum; value <= this.yMaximum; value += (this.yMaximum - this.yMinimum) / numberOfYTicks) {
      legendYTicksElement
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
        .attr('class', `tick`);
    }
  }

  protected drawScatterPlot(svgElement: SVGElement): void {
    const scatterPlotElement: SVGElement = svgElement
      .append('g')
      .attr('id', 'scatter-plot')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    for (let axisIndex = 0; axisIndex < this.xAxes.length; axisIndex++) {
      const xAxis: Array<number> = this.xAxes[axisIndex];
      const yAxis: Array<number> = this.yAxes[axisIndex];

      for (let index = 0; index < xAxis.length; index++) {
        scatterPlotElement
          .append('circle')
          .attr(
            'cx',
            this.transformX(
              (xAxis[index] - this.xMinimum) * this.xPixelsPerUnit,
              this.scatterPlotHeight,
              this.scatterPlotWidth,
            ),
          )
          .attr(
            'cy',
            this.transformY(
              (yAxis[index] - this.yMinimum) * this.yPixelsPerUnit,
              this.scatterPlotHeight,
              this.scatterPlotWidth,
            ),
          )
          .attr('class', `point axis-${axisIndex + 1}`);
      }
    }
  }

  protected transformX(x: number, height: number, width: number): number {
    return x;
  }

  protected transformY(y: number, height: number, width: number): number {
    return height - y;
  }
}
