import {Component} from "../component";
import {Genome} from "../../../Genetics/genome";

export class DNA extends Component{

    constructor(public genomes: Genome[]) {
        super();
    }

}
