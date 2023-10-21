export type Gene = string;

export class Genome{

    constructor(public genes: Gene[] = []) {
        this.genes = genes;
    }

    public crossover(partner: Genome): Genome {
        const newGenes: Gene[] = [];

        let i = 0;
        while (i < this.genes.length) {
            const crossoverPoint = i + Math.floor(Math.random() * (this.genes.length - i));
            const chooseParent = Math.random() > 0.5;

            for (let j = i; j <= crossoverPoint; j++) {
                newGenes.push(chooseParent ? this.genes[j] : partner.genes[j]);
            }

            i = crossoverPoint + 1;
        }

        return new Genome(newGenes);
    }
}
