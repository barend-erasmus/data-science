export class EuclideanDistance {

    constructor(protected a: Array<number>, protected b: Array<number>) {

    }

    public calculate(): number { 
        let value: number = 0;

        for (let index = 0; index < this.a.length; index++) {
            value += Math.pow(this.a[index] - this.b[index], 2);
        }

        if (value === 0) {
            return 1;
        }

        return Math.sqrt(value);
    }

}