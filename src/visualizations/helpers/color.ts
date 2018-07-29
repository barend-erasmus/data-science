export class ColorHelper {

    public static calculateGradient(color1: Array<number>, color2: Array<number>, weight: number) {
        const invertedWeight: number = 1 - weight;

        const rgb: Array<number> = [
          Math.round(color1[0] * weight + color2[0] * invertedWeight),
          Math.round(color1[1] * weight + color2[1] * invertedWeight),
          Math.round(color1[2] * weight + color2[2] * invertedWeight)
        ];
      
        return rgb;
      }

}
