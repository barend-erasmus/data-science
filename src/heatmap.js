const colors = require("./colors");
const fs = require("fs").promises;
const parser = require("./parser");
const statsLite = require("stats-lite");
const { SVGElement } = require("./svg-element");

(async () => {
  let data = await parser.parseCSV("tomslee_airbnb_london_1486_2017-07-28.csv");

  const matrix = [];

  let maximiumX = 0;
  let maximiumY = 0;

  for (const datum of data) {
    const x = parseFloat(datum.accommodates);
    const y = parseFloat(datum.bedrooms);
    const value = parseFloat(datum.price);

    if (!x || !y || !value) {
      continue;
    }

    if (!matrix[x]) {
      matrix[x] = [];
    }

    if (!matrix[x][y]) {
      matrix[x][y] = [];
    }

    matrix[x][y].push(value);

    if (x > maximiumX) {
      maximiumX = x;
    }

    if (y > maximiumY) {
      maximiumY = y;
    }
  }

  const heightPerItem = 30;
  const widthPerItem = 30;

  const height = maximiumY * heightPerItem + heightPerItem;
  const width = maximiumX * widthPerItem + widthPerItem;

  const heatmapMatrix = [];

  for (let x = 0; x < maximiumX; x++) {
    if (!matrix[x]) {
      matrix[x] = [];
    }

    for (let y = 0; y < maximiumY; y++) {
      if (!matrix[x][y]) {
        matrix[x][y] = [];
      }

      const values = matrix[x][y];

      const value = values.length ? statsLite.mean(values) : 0;

      heatmapMatrix.push([x, y, value]);
    }
  }

  let maximiumValue = Math.max(...heatmapMatrix.map(x => x[2]));

  const svgElement = SVGElement.create("svg")
    .attr("height", height)
    .attr("width", width);

  for (const item of heatmapMatrix) {
    const x = item[0];
    const y = item[1];
    const value = item[2];

    const percentage = value / maximiumValue;

    const color = colors.calculateGradient(
      [255, 0, 0],
      [0, 0, 255],
      percentage
    );

    svgElement
      .append("rect")
      .attr("x", x * widthPerItem)
      .attr("y", y * heightPerItem)
      .attr("height", heightPerItem)
      .attr("width", widthPerItem)
      .attr("fill", `rgb(${color.join(",")})`);
  }

  await fs.writeFile("test.svg", svgElement.toString());
})();
