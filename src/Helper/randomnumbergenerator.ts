export class RandomNumberGenerator {
    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static randomGaussian(mean: number = 0, stdDev: number = 1): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        const x = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return x * stdDev + mean;
    }

    public static randomFromDistribution(distribution: [number, number][]): number {
        let sum = 0;
        /* eslint-disable @typescript-eslint/no-unused-vars */
        distribution.forEach(([_, prob]) => {
            sum += prob;
        });
        /* eslint-enable @typescript-eslint/no-unused-vars */

        let rand = this.randomFloat(0, sum);
        for (const [value, prob] of distribution) {
            rand -= prob;
            if (rand < 0) {
                return value;
            }
        }

        throw new Error('Invalid distribution');
    }
}
