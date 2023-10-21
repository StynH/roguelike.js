import {Component} from "../component";
import {DNA} from "./dna";

export class Fertilizable extends Component{

    public partnerDna: DNA | undefined;

    constructor() {
        super();
        this.partnerDna = undefined;
    }

}
