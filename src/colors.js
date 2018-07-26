function calculateGradient(color1, color2, weight) {
  const invertedWeight = 1 - weight;
  let rgb = [
    Math.round(color1[0] * weight + color2[0] * invertedWeight),
    Math.round(color1[1] * weight + color2[1] * invertedWeight),
    Math.round(color1[2] * weight + color2[2] * invertedWeight)
  ];

  return rgb;
}

module.exports = {
  calculateGradient
};
