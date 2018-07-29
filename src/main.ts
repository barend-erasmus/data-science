import * as fs from 'fs';
import { ScatterPlot } from './visualizations/scatter-plot';
import * as sass from 'node-sass';
import { Parser } from './parser';
import { EuclideanDistance } from './statistics/euclidean-distance';

const theme: string = sass
  .renderSync({
    data: fs.readFileSync('./src/visualizations/themes/basic-scatter-plot.sass', 'utf-8'),
  })
  .css.toString();

(async () => {
  const parser: Parser = new Parser('wind-guru-diving-visibility.csv');

  const data: any[] = await parser.fromCSV();

  const xAxis: number[] = data.map((x: any) => parseFloat(x['visibility']));

  const yAxis: Array<number> = data.map((x: any) => {
    return new EuclideanDistance(
      [
        // x['temperatureInCelsius'],
        x['waveDirectionInDegrees'],
        x['waveHeightInMeters'],
        x['wavePeriodInSeconds'],
        x['windDirectionInDegrees'],
        x['windSpeedInKnots'],
      ],
      [0, 0, 0, 0, 0],
    ).calculate();
  });

  const scatterPlot: ScatterPlot = new ScatterPlot(600, 600);

  scatterPlot.setData([xAxis], [yAxis]);

  const svg = scatterPlot.toString();

  await fs.promises.writeFile(
    'example.html',
    `<!DOCTYPE html>
  <html>
    <head>
        <title>Example</title>
    </head>
    <body>
        <style>
          ${theme}
        </style>
        ${svg}
    </body>
  </html>`,
  );
})();
