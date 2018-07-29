import * as fs from 'fs';
import { ScatterPlot } from './visualizations/scatter-plot';
import * as sass from 'node-sass';

const theme: string = sass
  .renderSync({
    data: fs.readFileSync('./src/visualizations/themes/basic-scatter-plot.sass', 'utf-8'),
  })
  .css.toString();

(async () => {
  const xAxis: number[] = Array.from({
    length: 30,
  }).map(() => Math.random() * 100);

  const yAxis: Array<number> = Array.from({
    length: 30,
  }).map(() => Math.random() * 100);

  const scatterPlot: ScatterPlot = new ScatterPlot(600, 600);

  scatterPlot.setData([xAxis], [yAxis]).setMinimumAndMaximum(0, 100, 0, 100);

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
