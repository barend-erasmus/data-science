const colors = require("./colors");
const fs = require("fs").promises;
const parser = require("./parser");
const statsLite = require('stats-lite');
const { SVGElement } = require("./svg-element");

(async () => {
  let data = await parser.parseCSV(
    "tomslee_airbnb_london_0250_2015-12-25.csv"
  );

  data = data.filter((x) => parseFloat(x.price) < 300);

  const matrix = [];

  let maximiumX = 0;
  let maximiumY = 0;
  let maximiumValue = 0;

  for (const datum of data) {
    const x = parseFloat(datum.minstay);
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

    if (value > maximiumValue) {
        maximiumValue = value;
    }
  }

  const heightPerItem = 30;
  const widthPerItem = 30;

  const height = (maximiumY * heightPerItem) + heightPerItem;
  const width = (maximiumX * widthPerItem) + widthPerItem;

  const svgElement = SVGElement.create("svg")
    .attr("height", height)
    .attr("width", width);

  for (let x = 0; x < matrix.length; x++) {
    if (!matrix[x]) {
      continue;
    }

    for (let y = 0; y < matrix[x].length; y++) {
      if (!matrix[x][y]) {
        continue;
      }

      const values = matrix[x][y];

      const value = values.sort()[values.length - 1];

      const percentage = value / maximiumValue;

      const color = colors.calculateGradient([255, 0, 0], [0, 0, 255], percentage);

      svgElement
        .append("rect")
        .attr("x", x * widthPerItem)
        .attr("y", y * heightPerItem)
        .attr("height", heightPerItem)
        .attr("width", widthPerItem)
        .attr(
          "fill",
          `rgb(${color.join(',')})` 
        );
    }
  }

  await fs.writeFile("test.svg", svgElement.toString());
})();
