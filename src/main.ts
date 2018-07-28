import * as fs from 'fs';
import { ScatterPlot } from './visualizations/scatter-plot';
import * as sass from 'node-sass';
import { Parser } from './parser';

const theme: string = sass
  .renderSync({
    data: fs.readFileSync('./src/visualizations/themes/basic-scatter-plot.sass', 'utf-8'),
  })
  .css.toString();

(async () => {
  const parser: Parser = new Parser('Demographic_Statistics_By_Zip_Code.csv');

  const data: any[] = await parser.fromCSV();

  const xAxis: number[] = data.map((x: any) => x['COUNT FEMALE']);

  const yAxis: number[] = data.map((x: any) => x['COUNT MALE']);

  const scatterPlot: ScatterPlot = new ScatterPlot(600, 600);

  scatterPlot.setData(xAxis, yAxis);

  const svg = scatterPlot.toString();

  await fs.promises.writeFile(
    'test.html',
    `<!DOCTYPE html>
  <html>
    <head>
        <title>Page Title</title>
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
