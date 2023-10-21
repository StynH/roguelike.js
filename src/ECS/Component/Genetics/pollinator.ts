import {Component} from "../component";

export class Pollinator extends Component{

    constructor(public interval: number = 5, public counter: number = 0, public range: number = 3) {
        super();
    }

}
